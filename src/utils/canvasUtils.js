export function mulberry32(seed) {
  let a = seed >>> 0
  return function random() {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function seedFromString(value) {
  let hash = 2166136261
  const text = String(value || 'taskframe')
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

export function roundRect(ctx, x, y, width, height, radius = 0) {
  const r = Math.max(0, Math.min(radius, width / 2, height / 2))
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + width, y, x + width, y + height, r)
  ctx.arcTo(x + width, y + height, x, y + height, r)
  ctx.arcTo(x, y + height, x, y, r)
  ctx.arcTo(x, y, x + width, y, r)
  ctx.closePath()
}

export function fillRoundRect(ctx, x, y, width, height, radius, fillStyle) {
  ctx.save()
  ctx.fillStyle = fillStyle
  roundRect(ctx, x, y, width, height, radius)
  ctx.fill()
  ctx.restore()
}

export function strokeRoundRect(ctx, x, y, width, height, radius, strokeStyle, lineWidth = 1) {
  ctx.save()
  ctx.strokeStyle = strokeStyle
  ctx.lineWidth = lineWidth
  roundRect(ctx, x, y, width, height, radius)
  ctx.stroke()
  ctx.restore()
}

export function wrapText(ctx, text, maxWidth) {
  const value = String(text || '')
  if (!value) return ['']
  if (maxWidth <= 0) return [value]
  const words = value.split(' ')
  const lines = []
  let current = ''

  const pushHardWrap = (chunk) => {
    let remaining = chunk
    while (remaining.length > 0) {
      let cut = remaining.length
      while (cut > 1 && ctx.measureText(remaining.slice(0, cut)).width > maxWidth) {
        cut -= 1
      }
      lines.push(remaining.slice(0, cut))
      remaining = remaining.slice(cut)
    }
  }

  words.forEach((word, index) => {
    const candidate = current ? `${current} ${word}` : word
    if (ctx.measureText(candidate).width <= maxWidth) {
      current = candidate
      return
    }
    if (current) lines.push(current)
    if (ctx.measureText(word).width <= maxWidth) {
      current = word
    } else {
      pushHardWrap(word)
      current = ''
    }
    if (index === words.length - 1 && current) {
      lines.push(current)
      current = ''
    }
  })

  if (current) lines.push(current)
  return lines.length ? lines : ['']
}

export function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight, align = 'left') {
  const lines = wrapText(ctx, text, maxWidth)
  ctx.textAlign = align
  lines.forEach((line, index) => {
    ctx.fillText(line, x, y + index * lineHeight)
  })
  return lines.length * lineHeight
}

export function createLinearGradient(ctx, x, y, width, height, stops, angle = 180) {
  const radians = ((angle - 90) * Math.PI) / 180
  const cx = x + width / 2
  const cy = y + height / 2
  const length = Math.hypot(width, height) / 2
  const gradient = ctx.createLinearGradient(
    cx - Math.cos(radians) * length,
    cy - Math.sin(radians) * length,
    cx + Math.cos(radians) * length,
    cy + Math.sin(radians) * length,
  )
  stops.forEach(([offset, color]) => gradient.addColorStop(offset, color))
  return gradient
}

export function hexToRgba(hex, alpha = 1) {
  const normalized = hex.replace('#', '')
  const full = normalized.length === 3
    ? normalized.split('').map((char) => char + char).join('')
    : normalized
  const value = Number.parseInt(full, 16)
  if (Number.isNaN(value)) return `rgba(255,255,255,${alpha})`
  const r = (value >> 16) & 255
  const g = (value >> 8) & 255
  const b = value & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

export function sanitizeDimension(value, fallback) {
  const numeric = Number.parseInt(value, 10)
  if (!Number.isFinite(numeric)) return fallback
  return clamp(numeric, 720, 2160)
}

export async function ensureFontsLoaded(specs) {
  if (typeof document === 'undefined' || !document.fonts) return
  try {
    await Promise.all(specs.map((spec) => document.fonts.load(spec)))
    await document.fonts.ready
  } catch {
    // Canvas will fall back to system fonts if a face is unavailable.
  }
}

export function setCanvasFont(ctx, { family, weight = 500, size, fallback = 'sans-serif' }) {
  const safeFamily = family ? `"${family}", ${fallback}` : fallback
  ctx.font = `${weight} ${size}px ${safeFamily}`
}
