import { createLinearGradient, fillRoundRect, setCanvasFont, wrapText } from '../utils/canvasUtils.js'
import { CREATIVE_FONTS, fitCreativeDimensions } from './creativeRegistry.js'

const imageCache = new Map()

function loadImage(source) {
  if (imageCache.has(source)) return imageCache.get(source)
  const promise = new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('The selected image could not be loaded. Please choose another image.'))
    image.src = source
  }).catch((error) => {
    imageCache.delete(source)
    throw error
  })
  imageCache.set(source, promise)
  return promise
}

async function loadFonts(layers) {
  if (!document.fonts) return
  const families = [...new Set(layers.map((layer) => layer.fontId))]
  await Promise.all(families.map(async (family) => {
    try {
      await document.fonts.load(`600 48px "${family}"`)
    } catch {
      // The registry fallback is used if a web font is unavailable.
    }
  }))
  await document.fonts.ready
}

function fontFor(layer) {
  return CREATIVE_FONTS.find((font) => font.id === layer.fontId) || CREATIVE_FONTS[0]
}

function fillBackground(ctx, project, image) {
  const { width, height, background } = project
  if (background.type === 'solid') {
    ctx.fillStyle = background.color
  } else {
    const angle = Number(background.angle)
    ctx.fillStyle = createLinearGradient(ctx, 0, 0, width, height, [
      [0, background.color],
      [1, background.endColor],
    ], Number.isFinite(angle) ? angle : 145)
  }
  ctx.fillRect(0, 0, width, height)

  if (image) {
    const scaleBase = background.imageFit === 'contain'
      ? Math.min(width / image.naturalWidth, height / image.naturalHeight)
      : Math.max(width / image.naturalWidth, height / image.naturalHeight)
    const scale = scaleBase * Math.max(1, Number(background.imageScale) || 1)
    const imageWidth = image.naturalWidth * scale
    const imageHeight = image.naturalHeight * scale
    const x = (width - imageWidth) * background.imageX
    const y = (height - imageHeight) * background.imageY
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(image, x, y, imageWidth, imageHeight)
  }

  if (Number(background.overlayOpacity) > 0) {
    ctx.save()
    ctx.globalAlpha = Math.min(0.9, Math.max(0, Number(background.overlayOpacity)))
    ctx.fillStyle = background.overlayColor
    ctx.fillRect(0, 0, width, height)
    ctx.restore()
  }
}

function drawTrackedText(ctx, text, x, y, spacing, align) {
  if (!spacing) {
    ctx.textAlign = align
    ctx.fillText(text, x, y)
    return
  }
  const characters = Array.from(text)
  const measuredWidth = characters.reduce((width, character) => width + ctx.measureText(character).width, 0)
    + spacing * Math.max(0, characters.length - 1)
  let cursor = align === 'center' ? x - measuredWidth / 2 : align === 'right' ? x - measuredWidth : x
  ctx.textAlign = 'left'
  characters.forEach((character) => {
    ctx.fillText(character, cursor, y)
    cursor += ctx.measureText(character).width + spacing
  })
}

function drawLayer(ctx, project, layer, selected) {
  if (!layer.text) return
  const { width, height } = project
  const x = Math.max(0, Math.min(1, Number(layer.x))) * width
  const y = Math.max(0, Math.min(1, Number(layer.y))) * height
  const font = fontFor(layer)
  const fontSize = Math.max(12, Math.min(width * 0.35, Number(layer.size) * width))
  const maxWidth = width * 0.84
  const spacing = Math.max(0, Number(layer.letterSpacing) || 0) * width
  const lineHeight = fontSize * Math.max(0.8, Math.min(2.5, Number(layer.lineHeight) || 1.2))
  const padding = Math.max(0, Number(layer.padding) || 0) * width
  const lines = layer.text.split('\n').flatMap((line) => wrapText(ctx, line, maxWidth))
  const measureLine = (line) => ctx.measureText(line).width + spacing * Math.max(0, Array.from(line).length - 1)
  const maxLineWidth = Math.max(0, ...lines.map(measureLine))
  const blockHeight = lines.length * lineHeight
  const rotation = (Number(layer.rotation) || 0) * Math.PI / 180
  const leftEdge = layer.align === 'left' ? -padding : layer.align === 'right'
    ? -maxLineWidth - padding
    : -maxLineWidth / 2 - padding

  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rotation)
  const opacity = Number(layer.opacity)
  ctx.globalAlpha = Math.max(0, Math.min(1, Number.isFinite(opacity) ? opacity : 1))
  setCanvasFont(ctx, { family: font.family, fallback: font.fallback, weight: 600, size: fontSize })
  ctx.textBaseline = 'middle'

  if (Number(layer.backgroundOpacity) > 0) {
    ctx.save()
    ctx.globalAlpha *= Math.max(0, Math.min(1, Number(layer.backgroundOpacity)))
    ctx.fillStyle = layer.backgroundColor
    fillRoundRect(ctx, leftEdge, -blockHeight / 2 - padding, maxLineWidth + padding * 2, blockHeight + padding * 2, Number(layer.radius) * width, layer.backgroundColor)
    ctx.restore()
  }

  ctx.fillStyle = layer.color
  if (layer.shadow) {
    ctx.shadowColor = layer.shadowColor
    ctx.shadowBlur = Math.max(0, Number(layer.shadowBlur) * width)
  }
  lines.forEach((line, index) => {
    const lineY = (index - (lines.length - 1) / 2) * lineHeight
    drawTrackedText(ctx, line, 0, lineY, spacing, layer.align)
  })

  if (selected) {
    ctx.shadowBlur = 0
    ctx.globalAlpha = 0.8
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = Math.max(2, width * 0.002)
    ctx.setLineDash([12, 8])
    ctx.strokeRect(leftEdge, -blockHeight / 2 - padding, maxLineWidth + padding * 2, blockHeight + padding * 2)
    ctx.setLineDash([])
  }
  ctx.restore()
}

export async function renderCreativeProject(canvas, project, options = {}) {
  if (!canvas) throw new Error('A canvas is required to render this design.')
  const dimensions = fitCreativeDimensions(project.width, project.height)
  const { width, height } = dimensions
  const layers = Array.isArray(project.layers) ? project.layers : []
  const image = project.background.image ? await loadImage(project.background.image) : null
  await loadFonts(layers)
  if (options.isCurrent && !options.isCurrent()) return { ...dimensions, cancelled: true }
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('This browser could not create a 2D canvas context.')
  ctx.clearRect(0, 0, width, height)
  fillBackground(ctx, { ...project, ...dimensions }, image)
  layers.forEach((layer) => drawLayer(ctx, { ...project, ...dimensions }, layer, options.selectedLayerId === layer.id))
  return { width, height }
}

export function getCreativeFontFamily(fontId) {
  return fontFor({ fontId }).family
}
