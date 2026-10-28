import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

afterEach(() => {
  cleanup()
  window.localStorage?.clear?.()
})

class MemoryStorage {
  constructor() {
    this.store = new Map()
  }

  getItem(key) {
    return this.store.has(key) ? this.store.get(key) : null
  }

  setItem(key, value) {
    this.store.set(key, String(value))
  }

  removeItem(key) {
    this.store.delete(key)
  }

  clear() {
    this.store.clear()
  }
}

if (!window.localStorage) {
  Object.defineProperty(window, 'localStorage', { value: new MemoryStorage() })
}

function createContextMock() {
  return {
    fillRect: vi.fn(),
    clearRect: vi.fn(),
    strokeRect: vi.fn(),
    beginPath: vi.fn(),
    closePath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    arc: vi.fn(),
    arcTo: vi.fn(),
    ellipse: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
    fillText: vi.fn(),
    strokeText: vi.fn(),
    drawImage: vi.fn(),
    measureText: vi.fn((text) => ({ width: String(text).length * 8 })),
    setTransform: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    createLinearGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
    createRadialGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
    createPattern: vi.fn(() => '#000'),
    createImageData: vi.fn((width, height) => ({ data: new Uint8ClampedArray(width * height * 4) })),
    putImageData: vi.fn(),
    bezierCurveTo: vi.fn(),
    setLineDash: vi.fn(),
    font: '',
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
    textAlign: 'left',
    textBaseline: 'alphabetic',
    globalAlpha: 1,
    shadowColor: '',
    shadowBlur: 0,
    imageSmoothingEnabled: true,
    imageSmoothingQuality: 'high',
  }
}

HTMLCanvasElement.prototype.getContext = vi.fn(function getContext() {
  if (!this.__ctx) this.__ctx = createContextMock()
  return this.__ctx
})
HTMLCanvasElement.prototype.toBlob = vi.fn((callback) => {
  callback(new Blob(['png'], { type: 'image/png' }))
})

if (!document.fonts) {
  document.fonts = {
    load: vi.fn(async () => []),
    ready: Promise.resolve(),
  }
}

if (!URL.createObjectURL) {
  URL.createObjectURL = vi.fn(() => 'blob:taskframe-test')
  URL.revokeObjectURL = vi.fn()
}
