const MAX_IMAGE_FILE_SIZE = 15 * 1024 * 1024
const MAX_IMAGE_EDGE = 2200
const MAX_IMAGE_DATA_LENGTH = 2_000_000

function loadImage(source) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('That image could not be opened. Try a different image file.'))
    image.src = source
  })
}

export async function prepareBackgroundImage(file) {
  if (!file || !file.type.startsWith('image/')) {
    throw new Error('Choose an image file to use as your wallpaper background.')
  }
  if (file.size > MAX_IMAGE_FILE_SIZE) {
    throw new Error('Choose an image smaller than 15 MB.')
  }

  const objectUrl = URL.createObjectURL(file)
  try {
    const image = await loadImage(objectUrl)
    const scale = Math.min(1, MAX_IMAGE_EDGE / Math.max(image.naturalWidth, image.naturalHeight))
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale))
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale))
    const context = canvas.getContext('2d')
    if (!context) throw new Error('This browser could not process the selected image.')

    context.drawImage(image, 0, 0, canvas.width, canvas.height)
    let dataUrl = canvas.toDataURL('image/jpeg', 0.84)
    if (dataUrl.length > MAX_IMAGE_DATA_LENGTH) {
      dataUrl = canvas.toDataURL('image/jpeg', 0.68)
    }
    if (dataUrl.length > MAX_IMAGE_DATA_LENGTH) {
      throw new Error('This image is too detailed to save in this browser. Try a smaller image.')
    }
    return dataUrl
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}
