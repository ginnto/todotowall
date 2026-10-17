import { useCallback, useState } from 'react'

function canUseStorage() {
  try {
    const key = '__taskframe_probe__'
    window.localStorage.setItem(key, '1')
    window.localStorage.removeItem(key)
    return true
  } catch {
    return false
  }
}

export function readStorage(key, fallback) {
  if (typeof window === 'undefined' || !canUseStorage()) return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (raw == null) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function writeStorage(key, value) {
  if (typeof window === 'undefined' || !canUseStorage()) return false
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function removeStorage(key) {
  if (typeof window === 'undefined' || !canUseStorage()) return
  try {
    window.localStorage.removeItem(key)
  } catch {
    // Ignore quota / privacy errors.
  }
}

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = readStorage(key, initialValue)
    return stored ?? initialValue
  })

  const setAndPersist = useCallback((next) => {
    setValue((current) => {
      const resolved = typeof next === 'function' ? next(current) : next
      writeStorage(key, resolved)
      return resolved
    })
  }, [key])

  return [value, setAndPersist, canUseStorage()]
}
