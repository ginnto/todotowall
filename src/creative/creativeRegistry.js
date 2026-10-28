import { FONT_CATEGORIES, FONT_REGISTRY } from '../fonts/fontRegistry.js'

export const CREATIVE_FORMATS = {
  wallpaper: [
    { id: 'phone', label: 'Phone wallpaper', width: 1080, height: 2400 },
    { id: 'fullhd', label: 'Full HD portrait', width: 1080, height: 1920 },
    { id: 'desktop', label: 'Desktop landscape', width: 1920, height: 1080 },
    { id: 'custom', label: 'Custom dimensions', width: 1080, height: 2400 },
  ],
  social: [
    { id: 'square-post', label: 'Square post', width: 1080, height: 1080 },
    { id: 'portrait-post', label: 'Portrait post', width: 1080, height: 1350 },
    { id: 'story', label: 'Story / Reel cover', width: 1080, height: 1920 },
  ],
}

export const CREATIVE_FONTS = FONT_REGISTRY
export { FONT_CATEGORIES }

export const MAX_CREATIVE_DIMENSION = 3840
export const MAX_CREATIVE_PIXELS = 8_294_400
export const MAX_TEXT_LAYERS = 30

export function getCreativeFormat(tool, formatId) {
  return CREATIVE_FORMATS[tool]?.find((format) => format.id === formatId) || CREATIVE_FORMATS[tool]?.[0]
}

export function fitCreativeDimensions(width, height) {
  const safeWidth = Math.max(720, Math.min(MAX_CREATIVE_DIMENSION, Math.round(Number(width) || 1080)))
  const safeHeight = Math.max(720, Math.min(MAX_CREATIVE_DIMENSION, Math.round(Number(height) || 1920)))
  const scale = Math.min(1, Math.sqrt(MAX_CREATIVE_PIXELS / (safeWidth * safeHeight)))
  return {
    width: Math.max(720, Math.floor(safeWidth * scale)),
    height: Math.max(720, Math.floor(safeHeight * scale)),
  }
}

export function createTextLayer(id) {
  return {
    id,
    text: 'Your words here',
    x: 0.5,
    y: 0.5,
    fontId: 'system-ui',
    size: 0.06,
    color: '#ffffff',
    opacity: 1,
    align: 'center',
    rotation: 0,
    letterSpacing: 0,
    lineHeight: 1.2,
    backgroundColor: '#111111',
    backgroundOpacity: 0,
    padding: 0.018,
    radius: 0.012,
    shadow: false,
    shadowColor: '#000000',
    shadowBlur: 0.012,
  }
}

export function createCreativeProject(tool = 'wallpaper') {
  const initialFormat = getCreativeFormat(tool, tool === 'social' ? 'square-post' : 'phone')
  return {
    formatId: initialFormat.id,
    width: initialFormat.width,
    height: initialFormat.height,
    background: {
      type: 'gradient',
      color: '#302642',
      endColor: '#db8e91',
      angle: 145,
      image: '',
      imageFit: 'cover',
      imageScale: 1,
      imageX: 0.5,
      imageY: 0.5,
      overlayColor: '#111111',
      overlayOpacity: 0,
    },
    layers: [],
  }
}

export function normalizeCreativeText(value) {
  return typeof value === 'string' ? value.slice(0, 500) : ''
}
