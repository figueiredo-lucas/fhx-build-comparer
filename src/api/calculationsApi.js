import { MAGIC_OPTS_MAGIC, MAGIC_OPTS_PYHS, MAGIC_OPTS_TMPL, WEAPON_TYPES } from "../constants"
import { calculateMasteryLevel, magicOptFromName } from "../utils"
import versions from '../versions'
import { getDiffFromClosestWeapon } from "./utils"

const calculationsApi = (version) => {

    const types = versions[version].types
    const raceClass = versions[version].raceClass
    const growthFactor = Math.exp(versions[version].growthFactor)
    const stats = versions[version].stats
    Object.values(stats).forEach(s => {
        s.expFactor = Math.exp(s.factor)
    })

    // Function to calculate base damage
    const calcBaseDmg = (obj = {}, level) => {
        return Math.pow(obj.base, Math.pow(growthFactor, obj.factor * level))
    }

    // Function to calculate glass cannon percentage for a stat
    const getGlassCannonPercent = (statType, statsDiff) => {
        const s = stats[statType]
        return Math.pow(s.expFactor, s.growth * statsDiff[statType])
    }

    // Function to calculate base physical damage without weapon (magic damage is always 0)
    const calcBasePhysDmgNoWeapon = (level) => {
        return Math.floor(calcBaseDmg(types.melee, level))
    }

    // Function to calculate base physical damage with weapon type
    const calcBasePhysDmg = (level, weaponType, race, charClass, str, dex, statsDiff) => {
        const base = calcBaseDmg(types[weaponType], level)
        const strPerPoint = calcBaseDmg(types[weaponType].str, level)
        const dexPerPoint = calcBaseDmg(types[weaponType].dex, level)

        const dmg = base + (strPerPoint * str * getGlassCannonPercent("str", statsDiff)) + (dexPerPoint * dex * getGlassCannonPercent("dex", statsDiff))
        return Math.floor(Math.floor(dmg) * raceClass[race].factor * raceClass[race].classes[charClass][weaponType])
    }

    // Function to calculate base magic damage with weapon
    const calcBaseMagicDmg = (level, race, charClass, int, statsDiff) => {
        const base = calcBaseDmg(types.magic, level)
        const intPerPoint = calcBaseDmg(types.magic.int, level)
        const dmg = base + (intPerPoint * int * getGlassCannonPercent("intel", statsDiff))
        return Math.floor(dmg * raceClass[race].factor * raceClass[race].classes[charClass].magic)
    }

    const getItemMagicOpts = (item, filter) =>
        [1, 2, 3, 4, 5, 6]
            .map(i => {
                const id = item[MAGIC_OPTS_TMPL[0].replace('[i]', i)]
                const value = item[MAGIC_OPTS_TMPL[1].replace('[i]', i)]
                return { id, value }
            })
            .filter(({ id }) => !!id && filter.includes(id))

    const getUserMagicOpts = (magicOpts, filter) =>
        magicOpts
            .filter(mo => mo?.name)
            .map(mo => {
                const mOpt = magicOptFromName(mo.name)
                if (mOpt)
                    return { id: mOpt.id_magic_opt, value: parseInt(mo.value) }
                return { id: null }
            })
            .filter(({ id }) => !!id && filter.includes(id))
        
    const getFlatAndPercentGrowth = (item, itemMagicOpts, filter) => {
        const magicOpts = getItemMagicOpts(item, filter)
        const userMagicOpts = getUserMagicOpts(itemMagicOpts, filter)

        const flat = item.item_magic_att_1 > 0
            ? magicOpts.find(mo => mo.id === filter[0])?.value || 0
            : userMagicOpts.find(mo => mo.id === filter[0])?.value || 0
        const percent = item.item_magic_att_1 > 0
            ? (magicOpts.find(mo => mo.id === filter[1])?.value || 0) / 100
            : (userMagicOpts.find(mo => mo.id === filter[1])?.value || 0) / 100

        return { flat, percent }
    }

    const getPhysDmg = (item, enchantLevel, itemMagicOpts = []) => {
        const enchant = enchantLevel * 0.05
        const min = item.item_offence_power_min
        const max = item.item_offence_power_max

        const { flat, percent } = getFlatAndPercentGrowth(item, itemMagicOpts, MAGIC_OPTS_PYHS)

        return {
            min: Math.floor(min + flat + Math.floor(min * enchant) + Math.floor(min * percent)),
            max: Math.floor(max + flat + Math.floor(max * enchant) + Math.floor(max * percent)),
        }
    }

    const getMagicDmg = (item, enchantLevel, itemMagicOpts = []) => {
        if (!item.item_magic_offence_min) return {}
        const enchant = enchantLevel * 0.05
        const min = item.item_magic_offence_min
        const max = item.item_magic_offence_max

        const { flat, percent } = getFlatAndPercentGrowth(item, itemMagicOpts, MAGIC_OPTS_MAGIC)

        return {
            min: Math.floor(min + flat + (min * enchant) + (min * percent)),
            max: Math.floor(max + flat + (max * enchant) + (max * percent)),
        }
    }

    const getStatPhysDmg = (build) => {
        if (!build.item || !build.race || !build.charClass || !build.level
            || !build.str.base || !build.dex.base
        ) {
            const noWepDmg = calcBasePhysDmgNoWeapon(build.level)
            return { min: noWepDmg, max: noWepDmg }
        }

        const weaponType = WEAPON_TYPES[build.item.item_type] === 'magic' ? 'melee' : WEAPON_TYPES[build.item.item_type]
        const weaponDmg = getPhysDmg(build.item, build.enchantLevel, build.itemMagicOpts)
        if (build.charClass === '0' && build.secondaryItem) {
            const secondaryWeaponDmg = getPhysDmg(build.secondaryItem, build.secondaryEnchantLevel, build.secondaryItemMagicOpts)
            weaponDmg.min += secondaryWeaponDmg.min
            weaponDmg.max += secondaryWeaponDmg.max
        }

        const statDiff = getDiffFromClosestWeapon(build.item, build.level, parseInt(build.str.base), parseInt(build.dex.base), 0)

        const baseDmg = calcBasePhysDmg(build.level, weaponType, build.race, build.charClass,
            parseInt(build.str.base) + parseInt(build.str.bonus || 0), parseInt(build.dex.base) + parseInt(build.dex.bonus || 0), statDiff)

        const mastery = calculateMasteryLevel(build)

        return {
            min: Math.floor(baseDmg + (weaponDmg.min * (1 + (parseFloat(mastery || 0) / 100)))),
            max: Math.floor(baseDmg + (weaponDmg.max * (1 + (parseFloat(mastery || 0) / 100))))
        }
    }

    const getStatMagicDmg = (build) => {
        if (!build.item || !build.race || !build.charClass
            || !build.level || !build.int.base || WEAPON_TYPES[build.item.item_type] !== 'magic') return { min: 0, max: 0 }

        const weaponDmg = getMagicDmg(build.item, build.enchantLevel, build.itemMagicOpts)

        const statDiff = getDiffFromClosestWeapon(build.item, build.level, 0, 0, parseInt(build.int.base))
        
        const baseDmg = calcBaseMagicDmg(build.level, build.race, build.charClass,
            parseInt(build.int.base) + parseInt(build.int.bonus || 0), statDiff)

        return {
            min: Math.floor(baseDmg + weaponDmg.min),
            max: Math.floor(baseDmg + weaponDmg.max)
        }
    }

    return {
        types,
        calcBaseDmg,
        getGlassCannonPercent,
        calcBasePhysDmgNoWeapon,
        calcBasePhysDmg,
        calcBaseMagicDmg,
        getPhysDmg,
        getMagicDmg,
        getStatPhysDmg,
        getStatMagicDmg
    }

}

export default calculationsApi