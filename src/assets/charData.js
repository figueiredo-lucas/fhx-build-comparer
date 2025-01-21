export const RACE_STATS = {
    '1': {
        vit: 11,
        str: 11,
        int: 7,
        dex: 9
    },
    '2': {
        vit: 7,
        str: 7,
        int: 13,
        dex: 11
    },
    '3': {
        vit: 8,
        str: 7,
        int: 11,
        dex: 12
    }
}

export const updateBaseStatByRace = (build, race) => {
    if (!['1', '2', '3'].includes(race)) return

    const stats = RACE_STATS[race]

    Object.keys(stats).forEach(stat => {
        if (!build[stat] || parseInt(build[stat]) < stats[stat]) {
            build[stat] = stats[stat]
        }
    })
    
}