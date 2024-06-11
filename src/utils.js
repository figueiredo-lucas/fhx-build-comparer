import items from './assets/items.json'
import magicOpts from './assets/magic-opts.json'
import masteries from './assets/masteries.json'
import ls from './api/localStorage'

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

export const masteriesFromCharClass = charClass => masteries.filter(m => m.charClass === +charClass)

export const calculateMasteryLevel = build => {
    const mastery = masteries.find(m => m.id === +build.mastery)
    if (!mastery) return 0
    
    return mastery.value_min_n_1 + mastery.diff_min_max_1 * (build.masteryLevel - 1)
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