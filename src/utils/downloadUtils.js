export function formatWallpaperFilename({ themeId, date, width, height }) {
  const safeTheme = String(themeId || 'theme').replace(/[^a-z0-9-]+/gi, '-').toLowerCase()
  const safeDate = String(date || new Date().toISOString().slice(0, 10)).replace(/[^0-9-]/g, '')
  return `taskframe-${safeTheme}-${safeDate}-${width}x${height}.png`
}

export function canvasToBlob(canvas, type = 'image/png') {
  return new Promise((resolve, reject) => {
    if (!canvas || typeof canvas.toBlob !== 'function') {
      reject(new Error('Canvas export is not available in this browser.'))
      return
    }
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('The wallpaper could not be exported as a PNG.'))
        return
      }
      resolve(blob)
    }, type)
  })
}

export async function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  try {
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.rel = 'noopener'
    document.body.appendChild(link)
    link.click()
    link.remove()
  } finally {
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
}

export async function downloadCanvasPng(canvas, filename) {
  const blob = await canvasToBlob(canvas)
  await downloadBlob(blob, filename)
  return blob
}
