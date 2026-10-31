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

export async function downloadCanvasVideo(canvas, video, duration, renderFrame, filename) {
  if (!canvas?.captureStream || typeof MediaRecorder === 'undefined') {
    throw new Error('Video export is not supported in this browser. Try a current version of Chrome or Edge.')
  }

  const mediaType = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm']
    .find((type) => !MediaRecorder.isTypeSupported || MediaRecorder.isTypeSupported(type))
  if (!mediaType) throw new Error('This browser cannot encode WebM video.')

  const stream = canvas.captureStream(30)
  let recorder
  let frameRequest
  let timeout
  try {
    recorder = new MediaRecorder(stream, { mimeType: mediaType })
    const chunks = []
    const stopped = new Promise((resolve, reject) => {
      recorder.ondataavailable = (event) => {
        if (event.data.size) chunks.push(event.data)
      }
      recorder.onerror = () => reject(new Error('The video recording failed. Please try again.'))
      recorder.onstop = () => resolve(new Blob(chunks, { type: mediaType }))
    })

    await new Promise((resolve, reject) => {
      video.onseeked = resolve
      video.onerror = () => reject(new Error('The selected video could not be played.'))
      video.currentTime = 0
      if (video.currentTime === 0 && video.readyState >= 2) resolve()
    })
    await renderFrame()
    await video.play()
    recorder.start()

    const drawFrame = async () => {
      await renderFrame()
      if (recorder.state === 'recording') frameRequest = requestAnimationFrame(drawFrame)
    }
    frameRequest = requestAnimationFrame(drawFrame)
    timeout = window.setTimeout(() => {
      if (recorder.state === 'recording') recorder.stop()
      video.pause()
    }, Math.min(30, duration) * 1000)

    const blob = await stopped
    await downloadBlob(blob, filename)
    return blob
  } finally {
    if (timeout) window.clearTimeout(timeout)
    if (frameRequest) cancelAnimationFrame(frameRequest)
    if (recorder?.state === 'recording') recorder.stop()
    video.pause()
    stream.getTracks().forEach((track) => track.stop())
  }
}
