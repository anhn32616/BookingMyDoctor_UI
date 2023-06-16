import { useRef, useState } from 'react'

export function useDebounce (value, delayTime) {

    const [debounceValue, setDebounceValue] = useState(value)
    const typingTimeoutRef = useRef(null)
    if (typingTimeoutRef.current)
    {
        clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => setDebounceValue(value), delayTime)
    return debounceValue
}