import items from '../assets/items.json'

export const getDiffFromClosestWeapon = (item, level, baseStr, baseDex, baseInt) => {
    if (!item) return { str: 0, dex: 0, intel: 0 }

    const type = item.item_type
    const diff = {}
    let levelDiff = level - item.item_need_level

    diff.str = Math.max(0, baseStr - item.item_need_str)
    if (item.item_need_dex) diff.dex = Math.max(0, baseDex - item.item_need_dex)
    if (item.item_need_str) diff.intel = Math.max(0, baseInt - item.item_need_str)

    for (const it of items) {
        if (it.item_type === type && level >= it.item_need_level && levelDiff > (level - it.item_need_level)) {
            levelDiff = level - it.item_need_level;
            diff.str = Math.max(0, baseStr - it.item_need_str)
            if (it.item_need_dex != -1)
                diff.dex = Math.max(0, baseDex - it.item_need_dex)
            if (it.item_need_str != -1)
                diff.intel = Math.max(0, baseInt - it.item_need_str)
        }
    }
    return diff
}
