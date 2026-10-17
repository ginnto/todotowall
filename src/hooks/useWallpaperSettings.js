import { useCallback } from 'react'
import { DEFAULT_SETTINGS, DESIGN_PRESETS, HISTORY_LIMIT, STORAGE_KEYS } from '../constants.js'
import { getTheme } from '../themes/themeRegistry.js'
import { useLocalStorage } from './useLocalStorage.js'

function mergeSettings(value) {
  if (!value || typeof value !== 'object') return { ...DEFAULT_SETTINGS }
  return { ...DEFAULT_SETTINGS, ...value }
}

export function useWallpaperSettings() {
  const [settings, setSettings] = useLocalStorage(STORAGE_KEYS.settings, DEFAULT_SETTINGS)
  const [history, setHistory] = useLocalStorage(STORAGE_KEYS.history, [])
  const resolved = mergeSettings(settings)

  const updateSettings = useCallback((patch) => {
    setSettings((current) => mergeSettings({ ...current, ...patch }))
  }, [setSettings])

  const applyTheme = useCallback((themeId, extras = {}) => {
    const theme = getTheme(themeId)
    setSettings((current) => {
      const next = mergeSettings({
        ...current,
        themeId: theme.id,
        accentColor: '',
        backgroundColor: '',
        useCustomBackground: false,
        fontFamily: extras.fontFamily || '',
        layout: extras.layout || '',
        dividerStyle: extras.dividerStyle || '',
        decorationIntensity: extras.decorationIntensity ?? current.decorationIntensity,
        ...extras,
      })
      setHistory((entries) => {
        const item = { id: `${theme.id}-${Date.now()}`, themeId: theme.id, layout: next.layout || theme.layout, at: Date.now() }
        const deduped = [item, ...entries.filter((entry) => entry.themeId !== theme.id)].slice(0, HISTORY_LIMIT)
        return deduped
      })
      return next
    })
  }, [setHistory, setSettings])

  const resetCustomization = useCallback(() => {
    const theme = getTheme(resolved.themeId)
    setSettings((current) => mergeSettings({
      ...current,
      accentColor: '',
      backgroundColor: '',
      useCustomBackground: false,
      fontFamily: '',
      fontScale: 1,
      taskSpacing: 1,
      dividerStyle: '',
      decorationIntensity: 0.7,
      layout: '',
      completedStyle: 'checked',
      showDate: true,
      showCounter: true,
      showProgress: true,
      title: DEFAULT_SETTINGS.title,
      subtitle: DEFAULT_SETTINGS.subtitle,
      quote: DEFAULT_SETTINGS.quote,
      themeId: theme.id,
    }))
  }, [resolved.themeId, setSettings])

  const applyPreset = useCallback((presetId) => {
    const preset = DESIGN_PRESETS.find((item) => item.id === presetId)
    if (!preset) return
    applyTheme(preset.themeId, {
      layout: preset.layout,
      fontFamily: preset.fontFamily,
      decorationIntensity: preset.decorationIntensity,
    })
  }, [applyTheme])

  const surpriseMe = useCallback(() => {
    const themes = ['midnight-terminal', 'cosmic-focus', 'minimal-paper', 'neon-grid', 'soft-gradient', 'brutalist-focus', 'nature-zen', 'blueprint', 'retro-computing', 'monochrome-editorial']
    const layouts = ['compact', 'spacious', 'editorial', 'top-aligned']
    const fonts = ['Inter', 'Manrope', 'Space Grotesk', 'DM Sans', 'JetBrains Mono', 'IBM Plex Mono']
    const quotes = ['Make the next hour count.', 'Quiet progress is still progress.', 'Stay close to what matters.']
    const themeId = themes[Math.floor(Math.random() * themes.length)]
    applyTheme(themeId, {
      layout: layouts[Math.floor(Math.random() * layouts.length)],
      fontFamily: fonts[Math.floor(Math.random() * fonts.length)],
      decorationIntensity: 0.4 + Math.random() * 0.5,
      quote: quotes[Math.floor(Math.random() * quotes.length)],
    })
  }, [applyTheme])

  const cycleTheme = useCallback((direction = 1) => {
    const order = ['midnight-terminal', 'cosmic-focus', 'minimal-paper', 'neon-grid', 'soft-gradient', 'brutalist-focus', 'nature-zen', 'blueprint', 'retro-computing', 'monochrome-editorial']
    const index = order.indexOf(resolved.themeId)
    const next = order[(index + direction + order.length) % order.length]
    applyTheme(next)
  }, [applyTheme, resolved.themeId])

  const resetAll = useCallback(() => {
    setSettings({ ...DEFAULT_SETTINGS, listDate: new Date().toISOString().slice(0, 10) })
    setHistory([])
  }, [setHistory, setSettings])

  return {
    settings: resolved,
    history,
    updateSettings,
    applyTheme,
    resetCustomization,
    applyPreset,
    surpriseMe,
    cycleTheme,
    resetAll,
  }
}
