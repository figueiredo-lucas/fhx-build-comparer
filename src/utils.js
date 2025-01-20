import items from './assets/items.json'
import magicOpts from './assets/magic-opts.json'
import masteries from './assets/masteries'
import ls from './api/localStorage'
import {  MAGIC_OPTS_DEF_MAGIC, MAGIC_OPTS_DEF_PHYS, MAGIC_OPTS_STAT_KEYS, MAGIC_OPTS_STATS, MAGIC_OPTS_TMPL, WEAPON_TYPES } from './constants'
import { ITEM_TYPE } from './assets/itemTypes'

// https://youmightnotneed.com/lodash
export const get = (obj, path, defValue) => {
    
    // If path is not defined or it has false value
    if (!path) return undefined
    
    // Check if path is string or array. Regex : ensure that we do not have '.' and brackets.
    // Regex explained: https://regexr.com/58j0k
    const pathArray = Array.isArray(path) ? path : path.match(/([^[.\]])+/g)
    
    // Find value
    const result = pathArray.reduce(
        (prevObj, key) => prevObj && prevObj[key],
        obj,
    )
    
    // If found value is undefined return default value; otherwise return the value
    return result === undefined ? defValue : result
    
}

// https://youmightnotneed.com/lodash
export const set = (obj, path, value) => {
    
    // Regex explained: https://regexr.com/58j0k
    const pathArray = Array.isArray(path) ? path : path.match(/([^[.\]])+/g)
    
    pathArray.reduce((acc, key, i) => {
        if (acc[key] === undefined) acc[key] = {}
        if (i === pathArray.length - 1) acc[key] = value
        return acc[key]
    }, obj)
    
}

/*!
 * Check if two objects or arrays are equal
 * (c) 2021 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param  {*}       obj1 The first item
 * @param  {*}       obj2 The second item
 * @return {Boolean}       Returns true if they're equal in value
 */
export const isEqual = (obj1, obj2) => {
    
    /**
     * More accurately check the type of a JavaScript object
     * @param  {Object} obj The object
     * @return {String}     The object type
     */
    function getType(obj) {
        return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()
    }
    
    function areArraysEqual() {
        
        // Check length
        if (obj1.length !== obj2.length) return false
        
        // Check each item in the array
        for (let i = 0; i < obj1.length; i++) {
            if (!isEqual(obj1[i], obj2[i])) return false
        }
        
        // If no errors, return true
        return true
        
    }
    
    function areObjectsEqual() {
        
        if (Object.keys(obj1).length !== Object.keys(obj2).length) return false
        
        // Check each item in the object
        for (let key in obj1) {
            if (Object.prototype.hasOwnProperty.call(obj1, key)) {
                if (!isEqual(obj1[key], obj2[key])) return false
            }
        }
        
        // If no errors, return true
        return true
        
    }
    
    function areFunctionsEqual() {
        return obj1.toString() === obj2.toString()
    }
    
    function arePrimativesEqual() {
        return obj1 === obj2
    }
    
    // Get the object type
    let type = getType(obj1)
    
    // If the two items are not the same type, return false
    if (type !== getType(obj2)) return false
    
    // Compare based on type
    if (type === 'array') return areArraysEqual()
    if (type === 'object') return areObjectsEqual()
    if (type === 'function') return areFunctionsEqual()
    
    return arePrimativesEqual()
    
}

export const itemFromName = itemName => items.find(it => it.item_name === itemName)

export const itemFromId = itemId => items.find(it => it.id === +itemId)

export const magicOptFromId = idMagicOpt => magicOpts.find(mo => mo.id_magic_opt === idMagicOpt)

export const magicOptFromName = magicOptName => magicOpts
    .filter(mo => mo.id_magic_opt >= 100)
    .find(mo => mo.display_name === magicOptName?.trim())

export const masteriesFromCharClass = charClass => masteries.filter(m => m.charClass === +charClass)

export const calculateMasteryLevel = (build, isDefensive = false) => {
    const validMasteries = masteriesFromCharClass(build.charClass)
        .filter(m => !!m.isDefensive === isDefensive && m.shouldApply(build))
    
    let effect = 0

    validMasteries.forEach(mastery => {
        const userMastery = build.masteries.find(bm => mastery.id === bm.id)
        if (!userMastery) return
        effect += mastery.value_min_n_1 + mastery.diff_min_max_1 * ((userMastery.level || 1) - 1)
    })

    // gotta remove this mastery floor rounding
    return Math.floor(effect)
}

export const saveBuild = build => {
    const builds = ls.get('fhx.builds') || []
    const idx = builds.findIndex(b => b.id === build.id)
    if (idx > -1) {
        builds.splice(idx, 1, build)
    } else {
        builds.push(build)
    }
    ls.set('fhx.builds', builds)
}

export const discardBuild = build => {
    const builds = ls.get('fhx.builds') || []
    const idx = builds.findIndex(b => b.id === build.id)
    builds.splice(idx, 1)
    ls.set('fhx.builds', builds)
}

export const isBuildSaved = build => {
    const builds = ls.get('fhx.builds') || []
    return builds.some(b => b.id === build.id)
}

export const isBuildUpdated = build => {
    const builds = ls.get('fhx.builds') || []
    const savedBuild = builds.find(b => b.id === build.id)
    delete build.updatedAt
    delete savedBuild?.updatedAt
    return !isEqual(build, savedBuild)
}

export const getItemMagicOpts = (item, filter) => 
    [1, 2, 3, 4, 5, 6]
        .map(i => {
            const id = item[MAGIC_OPTS_TMPL[0].replace('[i]', i)]
            const value = item[MAGIC_OPTS_TMPL[1].replace('[i]', i)]
            return { id, value }
        })
        .filter(({ id }) => !!id && filter.includes(id))

export const getUserMagicOpts = (magicOpts, filter) =>
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