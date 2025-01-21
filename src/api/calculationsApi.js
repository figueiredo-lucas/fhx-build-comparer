import { ITEM_HAND_TYPE, ITEM_SLOT } from "../assets/itemTypes"
import { MAGIC_OPTS_MAGIC, MAGIC_OPTS_PYHS, WEAPON_TYPES } from "../constants"
import { calculateMasteryLevel, getFlatAndPercentGrowth, getStatBonusByItems } from "../utils"
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
        
        const leftHand = build.items[ITEM_SLOT.LEFT_HAND]
        const rightHand = build.items[ITEM_SLOT.RIGHT_HAND]

        if (!leftHand?.item || !build.race || !build.charClass || !build.level
            || !build.str || !build.dex
        ) {
            const noWepDmg = calcBasePhysDmgNoWeapon(build.level)
            return { min: noWepDmg, max: noWepDmg }
        }

        const weaponType = WEAPON_TYPES[leftHand.item.item_type] === 'magic' ? 'melee' : WEAPON_TYPES[leftHand.item.item_type]
        const weaponDmg = getPhysDmg(leftHand.item, leftHand.enchantLevel, leftHand.magicOpts)
        if (build.charClass === '0' && rightHand?.item) {
            const secondaryWeaponDmg = getPhysDmg(rightHand.item, rightHand.enchantLevel, rightHand.magicOpts)
            weaponDmg.min += secondaryWeaponDmg.min
            weaponDmg.max += secondaryWeaponDmg.max
        }

        const statDiff = getDiffFromClosestWeapon(leftHand.item, build.level, parseInt(build.str), parseInt(build.dex), 0)

        const bonuses = getStatBonusByItems(build)

        const baseDmg = calcBasePhysDmg(build.level, weaponType, build.race, build.charClass,
            parseInt(build.str) + parseInt(bonuses.str || 0), parseInt(build.dex) + parseInt(bonuses.dex || 0), statDiff)

        const mastery = calculateMasteryLevel(build)

        return {
            min: Math.floor(baseDmg + (weaponDmg.min * (1 + (parseFloat(mastery || 0) / 100)))),
            max: Math.floor(baseDmg + (weaponDmg.max * (1 + (parseFloat(mastery || 0) / 100))))
        }
    }

    const getStatMagicDmg = (build) => {
        const leftHand = build.items[ITEM_SLOT.LEFT_HAND]
        const rightHand = build.items[ITEM_SLOT.RIGHT_HAND]

        if (!build.race || !build.charClass
            || !build.level || !build.int) return { min: 0, max: 0 }

            
        if (leftHand?.item && WEAPON_TYPES[leftHand.item.item_type] !== 'magic') return { min: 0, max: 0 }
            
        let handItem = leftHand?.item

        if (rightHand?.item && WEAPON_TYPES[rightHand.item.item_type] && rightHand.item.hand_type === ITEM_HAND_TYPE.TWO_HANDED)
            handItem = rightHand.item

        if (!handItem) return { min: 0, max: 0 }

        
        const weaponDmg = getMagicDmg(leftHand.item, leftHand.enchantLevel, leftHand.magicOpts)
        
        const statDiff = getDiffFromClosestWeapon(build.item, build.level, 0, 0, parseInt(build.int))

        const bonuses = getStatBonusByItems(build)
        
        const baseDmg = calcBaseMagicDmg(build.level, build.race, build.charClass,
            parseInt(build.int) + parseInt(bonuses.int || 0), statDiff)

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