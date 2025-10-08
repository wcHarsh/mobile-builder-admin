// Safe localStorage utilities that work on both client and server

export const getLocalStorageItem = (key, defaultValue = '') => {
    if (typeof window === 'undefined') {
        return defaultValue
    }
    try {
        return localStorage.getItem(key) || defaultValue
    } catch (error) {
        console.warn(`Error accessing localStorage for key "${key}":`, error)
        return defaultValue
    }
}

export const setLocalStorageItem = (key, value) => {
    if (typeof window === 'undefined') {
        return
    }
    try {
        localStorage.setItem(key, value)
    } catch (error) {
        console.warn(`Error setting localStorage for key "${key}":`, error)
    }
}

export const removeLocalStorageItem = (key) => {
    if (typeof window === 'undefined') {
        return
    }
    try {
        localStorage.removeItem(key)
    } catch (error) {
        console.warn(`Error removing localStorage for key "${key}":`, error)
    }
}
