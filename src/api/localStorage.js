const get = (key, defaultValue = null) => {
    const item = localStorage.getItem(key)
    if (item)
        return JSON.parse(item)
    return defaultValue
}

const set = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value))
}

export default {
    get, set
}