import { useState, useEffect } from 'react'

export function useLocalStorage(key, defaultValue = '') {
    const [value, setValue] = useState(defaultValue)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedValue = localStorage.getItem(key)
            if (storedValue !== null) {
                setValue(storedValue)
            }
        }
    }, [key])

    const setStoredValue = (newValue) => {
        setValue(newValue)
        if (typeof window !== 'undefined') {
            localStorage.setItem(key, newValue)
        }
    }

    return [value, setStoredValue]
}
