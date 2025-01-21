import { ITEM_TYPE } from '../assets/itemTypes'
import { MAGIC_OPTS_DEF_MAGIC, MAGIC_OPTS_DEF_PHYS } from '../constants'
import versions from '../versions'
import { getStatBonusByItems, getStatByItems, getFlatAndPercentGrowth } from './items'

const constitutionApi = (version) => {

    const { regeneration, constitution } = versions[version]

    constitution.defense.physical.expFactor = Math.exp(constitution.defense.physical.expFactorBase)
    constitution.defense.magical.expFactor = Math.exp(constitution.defense.magical.expFactorBase)

    const physDef = constitution.defense.physical
    const magicDef = constitution.defense.magical

    /** calc the general value per point. */
    const _calcValuePerPoint = (obj, level) => 
        Math.pow(obj.statConstant, Math.exp(obj.expConstant * (level - (level - 1) * 0.2)))

    /** calc the growth of the arithmetic progression (used for base values). */
    const _apSum = (level) => ((1 + level) * level) / 2

    /** calc each kind of stat according to the given obj. */
    const _calcStat = (obj, level, race, charClass, stat, sumAp) => {
        
        const valPerPoint = _calcValuePerPoint(obj, level)
        
        let ap = 0

        if (sumAp)
            ap = _apSum(level) * obj.progFactor

        const baseVal = valPerPoint * stat + ap
        let value = Math.floor(baseVal * obj.races[race].factor * obj.races[race].classes[charClass].factor)

        if (sumAp)
            value = value + obj.races[race].minValue
        
        return value

    }

    const calculateHp = (build, stat, sumAp = true) => {
        if (!build.level || !build.race || !build.charClass) return 0
        return Math.floor(_calcStat(constitution.hp, parseInt(build.level), build.race, build.charClass, stat, sumAp))
    }
    const calculateMp = (build, stat, sumAp = true) => {
        if (!build.level || !build.race || !build.charClass) return 0
        return Math.floor(_calcStat(constitution.mp, parseInt(build.level), build.race, build.charClass, stat, sumAp))
    }
    const calculateSp = (build, stat, sumAp = true) => {
        if (!build.level || !build.race || !build.charClass) return 0
        return Math.floor(_calcStat(constitution.sp, parseInt(build.level), build.race, build.charClass, stat, sumAp))
    }

    const _regen = (level, stat, type) =>
        stat * Math.pow(type.growth, level) + type.base

    const _regenWithItem = (build, filter, type) => {
        const { flat, percent } = getStatByItems(build, filter)
        const regen = _regen(parseInt(build.level), build.vit || 0, type)
        return Math.floor((regen + flat) * (1 + percent));
    }

    const calculateHpRegen = (build) => _regenWithItem(build, [108, 201], regeneration.hp)
    const calculateMpRegen = (build) => _regenWithItem(build, [109, 202], regeneration.mp)
    const calculateSpRegen = (build) => _regenWithItem(build, [110, 203], regeneration.sp)

    const _valuePerPoint = (level, defSource) =>
        Math.pow(defSource.base, Math.pow(defSource.expFactor, (defSource.factor * level)))

    const _getDef = (level, race, cls, stat, defSource) => {
        const point = _valuePerPoint(level, defSource)
        return point * stat * defSource.races[race].factor * defSource.races[race].classes[cls].factor
            + defSource.races[race].initial
    }

    const calcBasePhysDef = (build) => {
        if (!build.level || !build.race || !build.charClass) return 0
        const bonuses = getStatBonusByItems(build)
        const stat = parseInt(build.str || 0) + parseInt(bonuses.str || 0)
        return Math.max(0, Math.floor(_getDef(parseInt(build.level), build.race, build.charClass, stat, physDef)))
    }

    const calcBaseMagicDef = (build) => {
        if (!build.level || !build.race || !build.charClass) return 0
        const bonuses = getStatBonusByItems(build)
        const stat = parseInt(build.int || 0) + parseInt(bonuses.int || 0)
        return Math.max(0, Math.floor(_getDef(parseInt(build.level), build.race, build.charClass, stat, magicDef)))
    }

    const getItemPhysDef = (item, enchantLevel, magicOpts) => {
        if (!item || item.item_defense_power < 0) return 0

        const def = item.item_defense_power

        const enchant = enchantLevel * (item.item_type === ITEM_TYPE.SHIELD ? 20 : 10)
        
        const { flat, percent } = getFlatAndPercentGrowth(item, magicOpts, MAGIC_OPTS_DEF_PHYS)
        
        return Math.floor(def + flat + enchant + (def * percent))
    }

    const getItemMagicDef = (item, enchantLevel, magicOpts) => {
        if (!item || item.item_magic_defence < 0) return 0

        const def = item.item_magic_defence

        const enchant = enchantLevel * (item.item_type === ITEM_TYPE.SHIELD ? 20 : 10)
        
        const { flat, percent } = getFlatAndPercentGrowth(item, magicOpts, MAGIC_OPTS_DEF_MAGIC)
        
        return Math.floor(def + flat + enchant + (def * percent))
    }

    const calcFullHp = build => {
        const { flat, percent } = getStatByItems(build, [105, 301])
        const bonuses = getStatBonusByItems(build)
        const base = calculateHp(build, build.vit)
        const bonus = calculateHp(build, bonuses.vit, false)
        return Math.floor(base + (base * percent) + flat + bonus)
    }

    const calcFullMp = build => {
        const { flat, percent } = getStatByItems(build, [106, 302])
        const bonuses = getStatBonusByItems(build)
        const base = calculateMp(build, build.int)
        const bonus = calculateMp(build, bonuses.int, false)
        return Math.floor(base + (base * percent) + flat + bonus)
    }

    const calcFullSp = build => {
        const { flat, percent } = getStatByItems(build, [107, 303])
        const bonuses = getStatBonusByItems(build)
        const base = calculateSp(build, build.vit)
        const bonus = calculateSp(build, bonuses.vit, false)
        return Math.floor(base + (base * percent) + flat + bonus)
    }



    return {
        calculateHp,
        calculateMp,
        calculateSp,
        calculateHpRegen,
        calculateMpRegen,
        calculateSpRegen,
        calcBasePhysDef,
        calcBaseMagicDef,
        getItemPhysDef,
        getItemMagicDef,
        calcFullHp,
        calcFullMp,
        calcFullSp,
    }
}

export default constitutionApi