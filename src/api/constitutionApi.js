import versions from '../versions'

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

    const calculateHpRegen = (level, stat) => Math.floor(_regen(level, stat, regeneration.hp))
    const calculateMpRegen = (level, stat) => Math.floor(_regen(level, stat, regeneration.mp))
    const calculateSpRegen = (level, stat) => Math.floor(_regen(level, stat, regeneration.sp))

    const _valuePerPoint = (level, defSource) =>
        Math.pow(defSource.base, Math.pow(defSource.expFactor, (defSource.factor * level)))

    const _getDef = (level, race, cls, stat, defSource) => {
        const point = _valuePerPoint(level, defSource)
        return point * stat * defSource.races[race].factor * defSource.races[race].classes[cls].factor
            + defSource.races[race].initial
    }

    const calcBasePhysDef = (build) => {
        if (!build.level || !build.race || !build.charClass) return 0
        const stat = parseInt(build.str.base || 0) + parseInt(build.str.bonus || 0)
        return Math.max(0, Math.floor(_getDef(parseInt(build.level), build.race, build.charClass, stat, physDef)))
    }

    const calcBaseMagicDef = (build) => {
        if (!build.level || !build.race || !build.charClass) return 0
        const stat = parseInt(build.int.base || 0) + parseInt(build.int.bonus || 0)
        return Math.max(0, Math.floor(_getDef(parseInt(build.level), build.race, build.charClass, stat, magicDef)))
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
    }
}

export default constitutionApi