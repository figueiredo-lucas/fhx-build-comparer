import { ITEM_TYPE } from "../assets/itemTypes"
import { MAGIC_OPTS_DEF_MAGIC, MAGIC_OPTS_DEF_PHYS, MAGIC_OPTS_STAT_KEYS, MAGIC_OPTS_STATS, MAGIC_OPTS_TMPL, WEAPON_TYPES } from "../constants"
import { magicOptFromName } from "../utils"

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

export const getFlatAndPercentGrowth = (item, itemMagicOpts, filter) => {
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

export const getStatBonusByItems = build => {
    const itemsContainer = Object.values(build.items)
    const stats = {
        vit: 0,
        int: 0,
        str: 0,
        dex: 0
    }

    itemsContainer.forEach(container => {
        if (!container.item) return

        const magicOpts = container.item.item_magic_att_1 > -1
            ? getItemMagicOpts(container.item, MAGIC_OPTS_STAT_KEYS)
            : getUserMagicOpts(container.magicOpts, MAGIC_OPTS_STAT_KEYS)

        magicOpts.forEach(mo => {
            stats[MAGIC_OPTS_STATS[mo.id]] = stats[MAGIC_OPTS_STATS[mo.id]] + mo.value
        })
    })

    return stats
}

export const getDefenseByItems = build => {
    const itemsContainer = Object.values(build.items)
    const stats = {
        physDef: 0,
        magicDef: 0
    }

    itemsContainer.forEach(container => {
        if (!container.item) return

        const enchant = container.enchantLevel * (container.item.item_type === ITEM_TYPE.SHIELD ? 20 : 10)

        const physGrowth = getFlatAndPercentGrowth(container.item, container.magicOpts, MAGIC_OPTS_DEF_PHYS)
        const magicGrowth = getFlatAndPercentGrowth(container.item, container.magicOpts, MAGIC_OPTS_DEF_MAGIC)

        const physDef = container.item.item_defense_power > 0 ? container.item.item_defense_power : 0
        const magicDef = container.item.item_magic_defence > 0 ? container.item.item_magic_defence : 0

        stats.physDef += physDef && Math.floor(physDef + physGrowth.flat + enchant + Math.floor(physDef * physGrowth.percent))
        stats.magicDef += magicDef && Math.floor(magicDef + magicGrowth.flat + enchant + Math.floor(magicDef * magicGrowth.percent))
    })

    return stats
}

export const getEvasionByItems = build => {
    const itemsContainer = Object.values(build.items)
    let evasion = 0

    itemsContainer.forEach(container => {
        if (!container.item) return

        evasion -= container.item.item_dodge_reduce > 0 ? container.item.item_dodge_reduce : 0

        const { flat } = getFlatAndPercentGrowth(container.item, container.magicOpts, [405, -1])

        evasion += flat

    })

    return evasion
}

export const getStatByItems = (build, filter) => {
    const itemsContainer = Object.values(build.items)
    let value = { flat: 0, percent: 0}

    itemsContainer.forEach(container => {
        if (!container.item) return

        const { flat, percent } = getFlatAndPercentGrowth(container.item, container.magicOpts, filter)

        value.flat += flat
        value.percent += percent

    })

    return value
}

export const hasEquippedWeapons = build => {
    const itemsContainer = Object.values(build.items)
    itemsContainer.some(ic => {
        if (!ic.item) return false
        return Object.keys(WEAPON_TYPES).map(k => parseInt(k)).includes(ic.item.item_type)
    })
}