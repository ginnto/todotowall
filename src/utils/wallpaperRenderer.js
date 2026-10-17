import { FONT_LOAD_SPECS } from '../constants.js'
import { getTheme, resolveTheme } from '../themes/themeRegistry.js'
import {
  createLinearGradient,
  drawWrappedText,
  ensureFontsLoaded,
  fillRoundRect,
  hexToRgba,
  mulberry32,
  seedFromString,
  setCanvasFont,
  strokeRoundRect,
  wrapText,
} from './canvasUtils.js'
import { computeLayout, getOutputSize } from './wallpaperLayouts.js'

function formatDisplayDate(value) {
  if (!value) return ''
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

function drawBackground(ctx, width, height, theme) {
  const stops = theme.background.map((color, index, list) => [index / Math.max(list.length - 1, 1), color])
  ctx.fillStyle = createLinearGradient(ctx, 0, 0, width, height, stops, theme.backgroundAngle)
  ctx.fillRect(0, 0, width, height)
}

function drawNoise(ctx, width, height, intensity, seed, color) {
  const random = mulberry32(seed)
  const tile = 96
  const tileCanvas = typeof document !== 'undefined' ? document.createElement('canvas') : null
  if (!tileCanvas) return
  tileCanvas.width = tile
  tileCanvas.height = tile
  const tileCtx = tileCanvas.getContext('2d')
  const image = tileCtx.createImageData(tile, tile)
  for (let i = 0; i < image.data.length; i += 4) {
    const shade = Math.floor(random() * 255)
    image.data[i] = shade
    image.data[i + 1] = shade
    image.data[i + 2] = shade
    image.data[i + 3] = Math.floor(18 * intensity * random())
  }
  tileCtx.putImageData(image, 0, 0)
  ctx.save()
  ctx.globalAlpha = 0.35
  ctx.fillStyle = ctx.createPattern(tileCanvas, 'repeat') || color
  ctx.fillRect(0, 0, width, height)
  ctx.restore()
}

function drawDecorations(ctx, width, height, theme, intensity) {
  const amount = Math.max(0, Math.min(1, intensity ?? 0.7))
  if (amount <= 0.02) return
  const random = mulberry32(seedFromString(theme.id))
  ctx.save()
  ctx.globalAlpha = amount

  if (theme.decoration === 'terminal') {
    ctx.strokeStyle = hexToRgba(theme.accent, 0.18)
    ctx.lineWidth = 1
    ctx.strokeRect(48, 48, width - 96, height - 96)
    ctx.fillStyle = hexToRgba(theme.accent, 0.7)
    ctx.font = `500 ${Math.max(14, width * 0.016)}px "${theme.fontFamily}", monospace`
    ctx.fillText('> taskframe --lockscreen', 72, height - 80)
    for (let y = 0; y < height; y += 4) {
      ctx.fillStyle = hexToRgba('#000000', 0.08)
      ctx.fillRect(0, y, width, 1)
    }
  }

  if (theme.decoration === 'cosmic') {
    for (let i = 0; i < 90; i += 1) {
      const x = random() * width
      const y = random() * height
      const r = random() * 1.8 + 0.4
      ctx.fillStyle = hexToRgba('#FFFFFF', 0.2 + random() * 0.6)
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.strokeStyle = hexToRgba(theme.accent, 0.22)
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.ellipse(width * 0.78, height * 0.22, width * 0.28, width * 0.18, 0.4, 0, Math.PI * 2)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(width * 0.78, height * 0.22, 10, 0, Math.PI * 2)
    ctx.stroke()
  }

  if (theme.decoration === 'paper') {
    drawNoise(ctx, width, height, amount, seedFromString(theme.id), theme.text)
    ctx.strokeStyle = hexToRgba(theme.divider, 1)
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(width * 0.12, height * 0.11)
    ctx.lineTo(width * 0.88, height * 0.11)
    ctx.stroke()
  }

  if (theme.decoration === 'grid') {
    ctx.strokeStyle = hexToRgba(theme.accent, 0.12)
    ctx.lineWidth = 1
    const step = 54
    for (let x = 0; x <= width; x += step) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }
    for (let y = 0; y <= height; y += step) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }
    ctx.fillStyle = hexToRgba(theme.accent, 0.12)
    ctx.fillRect(0, height * 0.72, width, 2)
  }

  if (theme.decoration === 'gradient') {
    ctx.fillStyle = hexToRgba('#FFFFFF', 0.18)
    ctx.beginPath()
    ctx.arc(width * 0.85, height * 0.08, width * 0.28, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = hexToRgba(theme.accent, 0.12)
    ctx.beginPath()
    ctx.arc(width * 0.1, height * 0.88, width * 0.32, 0, Math.PI * 2)
    ctx.fill()
  }

  if (theme.decoration === 'brutalist') {
    ctx.fillStyle = theme.text
    ctx.fillRect(0, 0, 18, height)
    ctx.fillRect(width - 18, 0, 18, height)
    ctx.fillStyle = theme.accent
    ctx.fillRect(width * 0.62, 0, width * 0.38, 28)
    ctx.fillStyle = theme.text
    ctx.fillRect(48, height - 92, 120, 12)
  }

  if (theme.decoration === 'nature') {
    ctx.strokeStyle = hexToRgba(theme.accent, 0.28)
    ctx.lineWidth = 1.5
    for (let i = 0; i < 6; i += 1) {
      ctx.beginPath()
      ctx.moveTo(0, height * (0.2 + i * 0.12))
      ctx.bezierCurveTo(
        width * 0.3,
        height * (0.16 + i * 0.12),
        width * 0.6,
        height * (0.26 + i * 0.12),
        width,
        height * (0.18 + i * 0.12),
      )
      ctx.stroke()
    }
    ctx.fillStyle = hexToRgba(theme.accent, 0.08)
    ctx.beginPath()
    ctx.ellipse(width * 0.8, height * 0.18, 90, 140, 0.4, 0, Math.PI * 2)
    ctx.fill()
  }

  if (theme.decoration === 'blueprint') {
    ctx.strokeStyle = hexToRgba(theme.accent, 0.18)
    ctx.lineWidth = 1
    const step = 48
    for (let x = 40; x < width; x += step) {
      ctx.beginPath()
      ctx.moveTo(x, 40)
      ctx.lineTo(x, height - 40)
      ctx.stroke()
    }
    for (let y = 40; y < height; y += step) {
      ctx.beginPath()
      ctx.moveTo(40, y)
      ctx.lineTo(width - 40, y)
      ctx.stroke()
    }
    ctx.setLineDash([6, 8])
    ctx.strokeRect(36, 36, width - 72, height - 72)
    ctx.setLineDash([])
    ctx.fillStyle = hexToRgba(theme.accent, 0.8)
    ctx.font = `500 ${Math.max(14, width * 0.014)}px "${theme.fontFamily}", monospace`
    ctx.fillText('A1  /  LOCK SCREEN SHEET', 56, height - 64)
  }

  if (theme.decoration === 'retro') {
    ctx.fillStyle = hexToRgba(theme.accent, 0.12)
    for (let y = 70; y < height; y += 8) {
      ctx.fillRect(0, y, width, 2)
    }
    ctx.strokeStyle = hexToRgba(theme.accent, 0.35)
    ctx.strokeRect(40, 40, width - 80, height - 80)
    const pixel = 10
    for (let i = 0; i < 18; i += 1) {
      ctx.fillStyle = hexToRgba(theme.accent, 0.35 + random() * 0.4)
      ctx.fillRect(64 + i * pixel, 64, pixel - 2, pixel - 2)
    }
  }

  if (theme.decoration === 'editorial') {
    ctx.strokeStyle = hexToRgba('#FFFFFF', 0.2)
    ctx.lineWidth = 2
    ctx.strokeRect(42, 42, width - 84, height - 84)
    ctx.fillStyle = hexToRgba('#FFFFFF', 0.85)
    ctx.fillRect(paddingSafe(width), height * 0.105, 72, 8)
  }

  ctx.restore()
}

function paddingSafe(width) {
  return width * 0.12
}

function drawCheckbox(ctx, theme, x, y, size, completed) {
  const style = theme.checkbox
  ctx.save()
  if (style === 'circle') {
    ctx.strokeStyle = theme.accent
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(x + size / 2, y + size / 2, size / 2 - 1, 0, Math.PI * 2)
    ctx.stroke()
    if (completed) {
      ctx.fillStyle = theme.accent
      ctx.beginPath()
      ctx.arc(x + size / 2, y + size / 2, size / 2 - 5, 0, Math.PI * 2)
      ctx.fill()
    }
  } else if (style === 'terminal') {
    ctx.strokeStyle = theme.accent
    ctx.strokeRect(x, y, size, size)
    ctx.fillStyle = theme.accent
    ctx.font = `600 ${size}px "${theme.fontFamily}", monospace`
    ctx.textBaseline = 'middle'
    ctx.fillText(completed ? 'x' : ' ', x + size * 0.22, y + size / 2)
  } else if (style === 'brutal') {
    ctx.fillStyle = completed ? theme.accent : 'transparent'
    ctx.strokeStyle = theme.text
    ctx.lineWidth = 3
    ctx.strokeRect(x, y, size, size)
    if (completed) ctx.fillRect(x, y, size, size)
  } else {
    strokeRoundRect(ctx, x, y, size, size, 4, theme.accent, 2)
    if (completed) fillRoundRect(ctx, x + 4, y + 4, size - 8, size - 8, 2, theme.accent)
  }
  ctx.restore()
}

function drawProgress(ctx, theme, layout, settings, progress) {
  if (!settings.showProgress) return
  const y = layout.safeTop + layout.titleSize * 1.35 + layout.metaSize * 2.1 + (settings.subtitle ? layout.bodySize : 0)
  const x = layout.contentLeft
  const width = layout.contentWidth
  ctx.save()
  ctx.fillStyle = hexToRgba(theme.muted, 0.35)
  if (theme.progress === 'block') {
    ctx.fillRect(x, y, width, 16)
    ctx.fillStyle = theme.accent
    ctx.fillRect(x, y, width * (progress.percent / 100), 16)
  } else if (theme.progress === 'segmented' || theme.progress === 'technical') {
    const slots = 12
    const gap = 6
    const slotW = (width - gap * (slots - 1)) / slots
    const filled = Math.round((progress.percent / 100) * slots)
    for (let i = 0; i < slots; i += 1) {
      ctx.fillStyle = i < filled ? theme.accent : hexToRgba(theme.muted, 0.35)
      ctx.fillRect(x + i * (slotW + gap), y, slotW, 8)
    }
  } else if (theme.progress === 'neon' || theme.progress === 'glow') {
    fillRoundRect(ctx, x, y, width, 10, 8, hexToRgba(theme.muted, 0.25))
    ctx.shadowColor = theme.accent
    ctx.shadowBlur = 18
    fillRoundRect(ctx, x, y, Math.max(10, width * (progress.percent / 100)), 10, 8, theme.accent)
  } else {
    fillRoundRect(ctx, x, y, width, 6, 4, hexToRgba(theme.muted, 0.3))
    fillRoundRect(ctx, x, y, width * (progress.percent / 100), 6, 4, theme.accent)
  }
  ctx.restore()
}

function drawHeader(ctx, theme, layout, settings, progress) {
  const x = layout.align === 'center' ? layout.width / 2 : layout.contentLeft
  ctx.fillStyle = theme.text
  ctx.textAlign = layout.align
  ctx.textBaseline = 'alphabetic'
  setCanvasFont(ctx, { family: theme.fontFamily, weight: 700, size: layout.titleSize, fallback: theme.fallback })
  ctx.fillText(settings.title || "TODAY'S FOCUS", x, layout.safeTop + layout.titleSize)

  let metaY = layout.safeTop + layout.titleSize + layout.metaSize * 1.4
  setCanvasFont(ctx, { family: theme.fontFamily, weight: 500, size: layout.metaSize, fallback: theme.fallback })
  ctx.fillStyle = theme.muted
  const meta = []
  if (settings.showDate) meta.push(formatDisplayDate(settings.listDate))
  if (settings.showCounter) meta.push(`${progress.completed}/${progress.total} complete`)
  if (meta.length) ctx.fillText(meta.join('   ·   '), x, metaY)

  if (settings.subtitle) {
    ctx.fillStyle = theme.text
    setCanvasFont(ctx, { family: theme.fontFamily, weight: 400, size: layout.metaSize * 1.1, fallback: theme.fallback })
    metaY += layout.metaSize * 1.6
    drawWrappedText(ctx, settings.subtitle, x, metaY, layout.contentWidth, layout.metaSize * 1.35, layout.align)
  }
}

function drawTasks(ctx, theme, layout, settings) {
  let y = layout.listTop
  const tasks = layout.visibleTasks
  ctx.textBaseline = 'middle'

  if (tasks.length === 0) {
    ctx.fillStyle = theme.muted
    ctx.textAlign = layout.align
    setCanvasFont(ctx, { family: theme.fontFamily, weight: 500, size: layout.bodySize, fallback: theme.fallback })
    const message = 'Add tasks in the studio to compose this frame.'
    const x = layout.align === 'center' ? layout.width / 2 : layout.contentLeft
    drawWrappedText(ctx, message, x, y, layout.contentWidth, layout.bodySize * 1.4, layout.align)
    return y
  }

  tasks.forEach((task) => {
    const checkbox = layout.checkbox
    const textX = layout.align === 'center' ? layout.width / 2 : layout.contentLeft + checkbox + 22
    const boxX = layout.contentLeft
    const maxWidth = layout.align === 'center' ? layout.contentWidth : layout.contentWidth - checkbox - 22
    setCanvasFont(ctx, { family: theme.fontFamily, weight: 500, size: layout.bodySize, fallback: theme.fallback })
    const lines = wrapText(ctx, task.text, maxWidth)
    const blockHeight = Math.max(checkbox, lines.length * layout.bodySize * 1.25)

    if (layout.align !== 'center') {
      drawCheckbox(ctx, theme, boxX, y + (blockHeight - checkbox) / 2, checkbox, task.completed)
    } else {
      drawCheckbox(ctx, theme, layout.width / 2 - maxWidth / 2 - checkbox - 16, y + (blockHeight - checkbox) / 2, checkbox, task.completed)
    }

    const dim = settings.completedStyle === 'dimmed' && task.completed
    ctx.fillStyle = dim ? hexToRgba(theme.muted, 0.85) : theme.text
    ctx.textAlign = layout.align === 'center' ? 'center' : 'left'
    lines.forEach((line, index) => {
      const lineY = y + layout.bodySize * 0.7 + index * layout.bodySize * 1.25
      ctx.fillText(line, textX, lineY)
      if (settings.completedStyle === 'strikethrough' && task.completed) {
        const width = ctx.measureText(line).width
        ctx.strokeStyle = theme.muted
        ctx.beginPath()
        const start = layout.align === 'center' ? textX - width / 2 : textX
        ctx.moveTo(start, lineY)
        ctx.lineTo(start + width, lineY)
        ctx.stroke()
      }
    })

    if (settings.dividerStyle && settings.dividerStyle !== 'none') {
      ctx.save()
      ctx.strokeStyle = theme.divider
      ctx.lineWidth = settings.dividerStyle === 'thick' ? 3 : 1
      if (settings.dividerStyle === 'dots') ctx.setLineDash([2, 8])
      ctx.beginPath()
      ctx.moveTo(layout.contentLeft, y + blockHeight + layout.itemGap * 0.45)
      ctx.lineTo(layout.contentLeft + layout.contentWidth, y + blockHeight + layout.itemGap * 0.45)
      ctx.stroke()
      ctx.restore()
    }

    y += blockHeight + layout.itemGap
  })
  return y
}

export function getWallpaperProgress(tasks) {
  const total = tasks.length
  const completed = tasks.filter((task) => task.completed).length
  return { total, completed, remaining: total - completed, percent: total ? Math.round((completed / total) * 100) : 0 }
}

export async function renderWallpaper(canvas, payload, options = {}) {
  const settings = payload.settings
  const output = options.size || getOutputSize(settings)
  const pixelRatio = options.pixelRatio || 1
  const width = output.width
  const height = output.height

  if (!canvas) {
    throw new Error('A canvas is required to render the wallpaper.')
  }

  await ensureFontsLoaded(FONT_LOAD_SPECS)

  canvas.width = Math.round(width * pixelRatio)
  canvas.height = Math.round(height * pixelRatio)
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('This browser could not create a 2D canvas context.')
  }

  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
  ctx.clearRect(0, 0, width, height)
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'

  const theme = resolveTheme(getTheme(settings.themeId), settings)
  const layout = computeLayout({
    width,
    height,
    theme,
    settings,
    tasks: payload.tasks || [],
  })
  const progress = getWallpaperProgress(payload.tasks || [])

  drawBackground(ctx, width, height, theme)
  drawDecorations(ctx, width, height, theme, settings.decorationIntensity)
  drawHeader(ctx, theme, layout, settings, progress)
  drawProgress(ctx, theme, layout, settings, progress)
  drawTasks(ctx, theme, layout, settings)

  if (settings.quote) {
    ctx.fillStyle = theme.muted
    ctx.textAlign = layout.align
    setCanvasFont(ctx, { family: theme.fontFamily, weight: 400, size: layout.metaSize, fallback: theme.fallback })
    const x = layout.align === 'center' ? width / 2 : layout.contentLeft
    drawWrappedText(ctx, settings.quote, x, layout.safeBottom - layout.metaSize * 1.2, layout.contentWidth, layout.metaSize * 1.35, layout.align)
  }

  return { width, height, warning: layout.warning, theme }
}

export function createOffscreenCanvas() {
  if (typeof document === 'undefined') return null
  return document.createElement('canvas')
}
