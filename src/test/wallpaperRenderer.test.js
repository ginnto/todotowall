import { describe, expect, it } from 'vitest'
import { wrapText } from '../utils/canvasUtils.js'
import { formatWallpaperFilename } from '../utils/downloadUtils.js'
import { computeLayout, getAspectRatio, getOutputSize } from '../utils/wallpaperLayouts.js'
import { renderWallpaper } from '../utils/wallpaperRenderer.js'
import { getTheme, resolveTheme, THEMES } from '../themes/themeRegistry.js'
import { DEFAULT_SETTINGS } from '../constants.js'

describe('theme and layout helpers', () => {
  it('registers ten complete themes', () => {
    expect(THEMES).toHaveLength(10)
    THEMES.forEach((theme) => {
      expect(theme.background.length).toBeGreaterThan(0)
      expect(theme.fontFamily).toBeTruthy()
      expect(theme.decoration).toBeTruthy()
    })
  })

  it('resolves accent and layout overrides', () => {
    const theme = resolveTheme(getTheme('midnight-terminal'), { accentColor: '#00ff00', layout: 'editorial' })
    expect(theme.accent).toBe('#00ff00')
    expect(theme.layout).toBe('editorial')
  })

  it('returns preset and custom dimensions with a stable aspect ratio', () => {
    expect(getOutputSize({ dimensionId: 'standard' })).toEqual({ width: 1080, height: 2400 })
    expect(getOutputSize({ dimensionId: 'fullhd' })).toEqual({ width: 1080, height: 1920 })
    expect(getOutputSize({ dimensionId: 'desktop' })).toEqual({ width: 1920, height: 1080 })
    const custom = getOutputSize({ dimensionId: 'custom', customWidth: 900, customHeight: 1800 })
    expect(getAspectRatio({ dimensionId: 'custom', customWidth: 900, customHeight: 1800 })).toBe(custom.width / custom.height)
  })

  it('wraps long text using measureText', () => {
    const ctx = { measureText: (text) => ({ width: String(text).length * 10 }) }
    const lines = wrapText(ctx, 'Design the lock screen with care today', 80)
    expect(lines.length).toBeGreaterThan(1)
  })

  it('builds a dated filename', () => {
    expect(formatWallpaperFilename({ themeId: 'Neon Grid', date: '2026-10-17', width: 1080, height: 2400 }))
      .toBe('taskframe-neon-grid-2026-10-17-1080x2400.png')
  })

  it('warns when the list is denser than the layout prefers', () => {
    const tasks = Array.from({ length: 20 }, (_, index) => ({ id: String(index), text: `Task ${index}`, completed: false }))
    const layout = computeLayout({
      width: 1080,
      height: 1920,
      theme: resolveTheme(getTheme('minimal-paper'), { layout: 'editorial' }),
      settings: { ...DEFAULT_SETTINGS, completedStyle: 'checked' },
      tasks,
    })
    expect(layout.visibleTasks).toHaveLength(20)
    expect(layout.warning).toBeTruthy()
  })
})

describe('wallpaperRenderer', () => {
  it('draws with the current tasks and requested size', async () => {
    const canvas = document.createElement('canvas')
    const result = await renderWallpaper(canvas, {
      tasks: [{ id: '1', text: 'Ship the studio', completed: false }],
      settings: { ...DEFAULT_SETTINGS, title: 'TONIGHT' },
    }, { size: { width: 1080, height: 2400 }, pixelRatio: 1 })

    expect(result.width).toBe(1080)
    expect(result.height).toBe(2400)
    expect(canvas.width).toBe(1080)
    const ctx = canvas.getContext('2d')
    expect(ctx.fillText).toHaveBeenCalled()
    expect(ctx.fillRect).toHaveBeenCalled()
  })

  it('handles an empty task list without throwing', async () => {
    const canvas = document.createElement('canvas')
    await expect(renderWallpaper(canvas, {
      tasks: [],
      settings: DEFAULT_SETTINGS,
    })).resolves.toMatchObject({ width: 1080 })
  })
})
