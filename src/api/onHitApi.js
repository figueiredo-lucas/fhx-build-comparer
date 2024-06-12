import versions from '../versions'

// export const acc = {
//     minimum: 75,
//     maximum: 100,
//     expFactor: -0.08,
//     raceFactorGrowth: 0.05,
//     races: [, 0.9, 0.95, 1],
// }

// export const evade = {
//     factor: 1.97,
//     limit: 1,
//     base: 8,
//     races: [, 0.002, 0.0022, 0.0025],
// }

// export const crit = {
//     factor: 2.5,
//     limit: 1,
//     base: 5,
//     races: [, 0.0003, 0.00032, 0.00035],
// }

const onHitApi = (version) => {
    
    const acc = versions[version].acc
    const evade = versions[version].evade
    const crit = versions[version].crit

    // Function to calculate accuracy
    const calculateAccuracy = (race, dex) => {
        const minVal = acc.minimum * acc.races[race]
        const expVal = acc.expFactor * dex * (acc.races[race] + acc.raceFactorGrowth)
        return Math.max(minVal, acc.maximum * (1 - Math.exp(expVal))) / 100
    }

    // Function to calculate base value based on factor and dexterity
    const calculateBase = (value, dex) => {
        if (version === 'v1')
            return Math.pow(value.factor, dex) + value.base
        return Math.pow(dex, value.factor)
    }

    // Function to calculate evasiveness
    const calculateEvasiveness = (race, dex) => {
        const baseValue = calculateBase(evade, dex)
        if (version === 'v1')
            return Math.min(evade.limit, (baseValue * evade.races[race]) / 100)
        return Math.min(evade.limit, (baseValue * evade.races[race] + evade.base) / 100)
    }

    // Function to calculate critical chance
    const calculateCritical = (race, dex) => {
        const baseValue = calculateBase(crit, dex)
        if (version === 'v1')
            return Math.min(crit.limit, (baseValue * crit.races[race]) / 100)
        return Math.min(crit.limit, (baseValue * crit.races[race] + crit.base) / 100)
    }

    // Function to calculate block chance
    const calculateBlockChance = (level, str) => {
        return 0.1 * level + (0.2 * str)
    }

    return {
        calculateAccuracy,
        calculateBase,
        calculateEvasiveness,
        calculateCritical,
        calculateBlockChance
    }
}



export default onHitApi