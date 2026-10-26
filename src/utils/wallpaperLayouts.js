import { clamp } from './canvasUtils.js'
import { getVisibleWallpaperTasks } from './taskUtils.js'

export const LAYOUT_PRESETS = {
  compact: {
    id: 'compact',
    paddingXRatio: 0.1,
    titleSizeRatio: 0.032,
    itemMinGap: 18,
    itemBaseGap: 28,
    checkbox: 22,
    maxTasks: 24,
    align: 'left',
    density: 0.88,
  },
  spacious: {
    id: 'spacious',
    paddingXRatio: 0.12,
    titleSizeRatio: 0.036,
    itemMinGap: 26,
    itemBaseGap: 44,
    checkbox: 26,
    maxTasks: 16,
    align: 'left',
    density: 1,
  },
  editorial: {
    id: 'editorial',
    paddingXRatio: 0.14,
    titleSizeRatio: 0.04,
    itemMinGap: 24,
    itemBaseGap: 42,
    checkbox: 24,
    maxTasks: 12,
    align: 'center',
    density: 1.05,
  },
  'top-aligned': {
    id: 'top-aligned',
    paddingXRatio: 0.1,
    titleSizeRatio: 0.034,
    itemMinGap: 20,
    itemBaseGap: 34,
    checkbox: 24,
    maxTasks: 18,
    align: 'left',
    density: 0.94,
  },
}

export function getOutputSize(settings) {
  if (settings.dimensionId === 'fullhd') {
    return { width: 1080, height: 1920 }
  }
  if (settings.dimensionId === 'desktop') {
    return { width: 1920, height: 1080 }
  }
  if (settings.dimensionId === 'custom') {
    return {
      width: clamp(Number(settings.customWidth) || 1080, 720, 3840),
      height: clamp(Number(settings.customHeight) || 2400, 720, 3840),
    }
  }
  return { width: 1080, height: 2400 }
}

export function getAspectRatio(settings) {
  const { width, height } = getOutputSize(settings)
  return width / height
}

export function computeLayout({ width, height, theme, settings, tasks }) {
  const preset = LAYOUT_PRESETS[theme.layout] || LAYOUT_PRESETS.spacious
  const visibleTasks = getVisibleWallpaperTasks(tasks, settings.completedStyle)
  const landscape = width > height
  const safeTop = height * (landscape ? 0.09 : theme.safeTopRatio)
  const safeBottom = height * (1 - (landscape ? 0.08 : theme.safeBottomRatio))
  const paddingX = width * preset.paddingXRatio
  const contentWidth = width - paddingX * 2
  const fontScale = clamp(Number(settings.fontScale) || 1, 0.8, 1.3)
  const spacingScale = clamp(Number(settings.taskSpacing) || 1, 0.7, 1.4)
  const titleSize = (landscape ? height * 0.045 : width * preset.titleSizeRatio) * fontScale
  const bodySize = Math.max(22, (landscape ? height * 0.03 : width * 0.028) * fontScale * preset.density)
  const metaSize = Math.max(16, (landscape ? height * 0.019 : width * 0.018) * fontScale)

  let cursor = safeTop
  const headerBlock = titleSize * (landscape ? 1.08 : 1.2)
    + metaSize * (landscape ? 1.8 : 2.4)
    + (settings.subtitle ? bodySize * (landscape ? 1.25 : 1.6) : 0)
  cursor += headerBlock
  if (settings.showProgress) cursor += landscape ? 28 : 48
  const quoteReserve = settings.quote ? bodySize * (landscape ? 1.7 : 2.4) : 32
  const listBottom = safeBottom - quoteReserve
  const available = Math.max(120, listBottom - cursor)
  const count = Math.max(visibleTasks.length, 1)
  let itemGap = preset.itemBaseGap * spacingScale
  const needed = count * (bodySize * 1.35 + itemGap)
  let warning = null

  if (needed > available) {
    itemGap = Math.max(preset.itemMinGap, itemGap * (available / needed))
  }

  const fittedHeight = count * (bodySize * 1.45 + itemGap)
  if (fittedHeight > available + 8) {
    warning = `This list is dense for ${width}×${height}. A shorter list or compact layout will read more clearly.`
  }

  if (visibleTasks.length > preset.maxTasks) {
    warning = `This layout is designed for up to ${preset.maxTasks} tasks. All tasks will still be drawn, but spacing will be tight.`
  }

  return {
    width,
    height,
    preset,
    paddingX,
    contentX: theme.layout === 'editorial' ? width / 2 : paddingX,
    contentLeft: paddingX,
    contentWidth,
    safeTop,
    safeBottom,
    listTop: cursor + 12,
    listBottom,
    titleSize,
    bodySize,
    metaSize,
    itemGap,
    checkbox: preset.checkbox * fontScale,
    align: preset.align,
    visibleTasks,
    warning,
    aspectRatio: width / height,
  }
}
