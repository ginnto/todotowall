const MAX_VIDEO_FILE_SIZE = 100 * 1024 * 1024

export async function prepareBackgroundVideo(file) {
  if (!file || !file.type.startsWith('video/')) {
    throw new Error('Choose a video file to use as your background.')
  }
  if (file.size > MAX_VIDEO_FILE_SIZE) {
    throw new Error('Choose a video smaller than 100 MB.')
  }

  const url = URL.createObjectURL(file)
  try {
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.src = url
    await new Promise((resolve, reject) => {
      video.onloadedmetadata = resolve
      video.onerror = () => reject(new Error('That video could not be opened. Try a different video file.'))
    })
    if (!Number.isFinite(video.duration) || video.duration <= 0) {
      throw new Error('That video has no playable duration. Choose another video.')
    }
    return { url, duration: video.duration }
  } catch (error) {
    URL.revokeObjectURL(url)
    throw error
  }
}
