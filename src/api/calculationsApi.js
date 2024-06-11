import { MAGIC_OPTS_MAGIC, MAGIC_OPTS_PYHS, MAGIC_OPTS_TMPL, WEAPON_TYPES } from "../constants"
import { calculateMasteryLevel } from "../utils"
import versions from '../versions'

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
        return Math.floor(dmg * raceClass[race].factor * raceClass[race].classes[charClass][weaponType])
    }

    // Function to calculate base magic damage with weapon
    const calcBaseMagicDmg = (level, race, charClass, int, statsDiff) => {
        const base = calcBaseDmg(types.magic, level)
        const intPerPoint = calcBaseDmg(types.magic.int, level)
        const dmg = base + (intPerPoint * int * getGlassCannonPercent("intel", statsDiff))
        return Math.floor(dmg * raceClass[race].factor * raceClass[race].classes[charClass].magic)
    }

    const getPhysDmg = (item, enchantLevel) => {
        const enchant = enchantLevel * 0.05
        const min = item.item_offence_power_min
        const max = item.item_offence_power_max

        const magicOpts = [1, 2, 3, 4, 5, 6]
            .map(i => {
                const id = item[MAGIC_OPTS_TMPL[0].replace('[i]', i)]
                const value = item[MAGIC_OPTS_TMPL[1].replace('[i]', i)]
                return { id, value }
            })
            .filter(({ id }) => !!id && MAGIC_OPTS_PYHS.includes(id))
        
        const flat = magicOpts.find(mo => mo.id === MAGIC_OPTS_PYHS[0])?.value || 0
        const percent = (magicOpts.find(mo => mo.id === MAGIC_OPTS_PYHS[1])?.value || 0) / 100

        return {
            min: Math.floor(min + flat + Math.floor(min * enchant) + Math.floor(min * percent)),
            max: Math.floor(max + flat + Math.floor(max * enchant) + Math.floor(max * percent)),
        }
    }

    const getMagicDmg = (item, enchantLevel) => {
        if (!item.item_magic_offence_min) return {}
        const enchant = enchantLevel * 0.05
        const min = item.item_magic_offence_min
        const max = item.item_magic_offence_max

        const magicOpts = [1, 2, 3, 4, 5, 6]
            .map(i => {
                const id = item[MAGIC_OPTS_TMPL[0].replace('[i]', i)]
                const value = item[MAGIC_OPTS_TMPL[1].replace('[i]', i)]
                return { id, value }
            })
            .filter(({ id }) => !!id && MAGIC_OPTS_MAGIC.includes(id))
        
        const flat = magicOpts.find(mo => mo.id === MAGIC_OPTS_MAGIC[0])?.value || 0
        const percent = (magicOpts.find(mo => mo.id === MAGIC_OPTS_MAGIC[1])?.value || 0) / 100
        
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
        const weaponDmg = getPhysDmg(build.item, build.enchantLevel)
        if (build.charClass === '0' && build.secondaryItem) {
            const secondaryWeaponDmg = getPhysDmg(build.secondaryItem, build.secondaryEnchantLevel)
            weaponDmg.min += secondaryWeaponDmg.min
            weaponDmg.max += secondaryWeaponDmg.max
        }

        const statDiff = {
            'dex': Math.max(0, parseInt(build.dex.base) - build.item.item_need_dex),
            'str': Math.max(0, parseInt(build.str.base) - build.item.item_need_str)
        }
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
        
        const weaponDmg = getMagicDmg(build.item, build.enchantLevel)

        const statDiff = {
            'intel': Math.max(0, parseInt(build.int.base) - build.item.item_need_int)
        }
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