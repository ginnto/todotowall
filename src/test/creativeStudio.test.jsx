import { act, render, renderHook, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import CreativeStudio from '../components/CreativeStudio.jsx'
import {
  CREATIVE_FONTS,
  FONT_CATEGORIES,
  CREATIVE_FORMATS,
  fitCreativeDimensions,
  MAX_CREATIVE_PIXELS,
} from '../creative/creativeRegistry.js'
import { renderCreativeProject } from '../creative/creativeRenderer.js'
import { useCreativeProject } from '../hooks/useCreativeProject.js'
import { prepareBackgroundImage } from '../utils/imageUtils.js'
import { ensureGoogleFontsLoaded } from '../fonts/fontRegistry.js'

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('creative format registry and project state', () => {
  it('offers a large free-font collection organized by aesthetic', () => {
    expect(CREATIVE_FONTS.length).toBeGreaterThanOrEqual(110)
    expect(FONT_CATEGORIES).toEqual([
      'Handwriting',
      'Calligraphy',
      'Cozy',
      'Minimal',
      'Professional',
      'Editorial',
      'Retro',
    ])
    expect(CREATIVE_FONTS.filter((font) => font.category === 'Calligraphy')).toHaveLength(16)
  })

  it('loads a selected Google font before its canvas is rendered', async () => {
    await expect(ensureGoogleFontsLoaded(['Great Vibes', 'unknown-local-font'])).resolves.toBeUndefined()
    const stylesheet = [...document.head.querySelectorAll('link[rel="stylesheet"]')]
      .find((link) => link.href.includes('fonts.googleapis.com') && link.href.includes('Great+Vibes'))
    expect(stylesheet).toBeTruthy()
    expect(stylesheet.href).toContain('wght@400')
  })

  it('centralizes the wallpaper and social output presets', () => {
    expect(CREATIVE_FORMATS.wallpaper.map(({ id, width, height }) => [id, width, height])).toEqual([
      ['phone', 1080, 2400],
      ['fullhd', 1080, 1920],
      ['desktop', 1920, 1080],
      ['custom', 1080, 2400],
    ])
    expect(CREATIVE_FORMATS.social.map(({ width, height }) => [width, height])).toEqual([
      [1080, 1080],
      [1080, 1350],
      [1080, 1920],
    ])
  })

  it('bounds custom dimensions without exceeding the pixel budget', () => {
    const dimensions = fitCreativeDimensions(3840, 3840)
    expect(dimensions.width).toBeLessThanOrEqual(3840)
    expect(dimensions.height).toBeLessThanOrEqual(3840)
    expect(dimensions.width * dimensions.height).toBeLessThanOrEqual(MAX_CREATIVE_PIXELS)
    expect(fitCreativeDimensions(12, 12)).toEqual({ width: 720, height: 720 })
  })

  it('adds, edits, duplicates, reorders and deletes independent text layers', () => {
    const { result } = renderHook(() => useCreativeProject('wallpaper'))
    act(() => result.current.addLayer())
    const firstId = result.current.project.layers[0].id

    act(() => result.current.updateLayer(firstId, { text: 'Morning list', x: 0.3 }))
    expect(result.current.project.layers[0]).toMatchObject({ text: 'Morning list', x: 0.3 })

    act(() => result.current.duplicateLayer(firstId))
    expect(result.current.project.layers).toHaveLength(2)
    expect(result.current.project.layers[1].text).toBe('Morning list')
    expect(result.current.project.layers[1].x).toBeCloseTo(0.34)

    act(() => result.current.moveLayer(firstId, 1))
    expect(result.current.project.layers[1].id).toBe(firstId)
    act(() => result.current.deleteLayer(firstId))
    expect(result.current.project.layers).toHaveLength(1)
  })

  it('keeps content and normalized text positions when switching social formats', () => {
    const { result } = renderHook(() => useCreativeProject('social'))
    act(() => result.current.addLayer())
    const layerId = result.current.project.layers[0].id
    act(() => result.current.updateLayer(layerId, { text: 'Keep this copy', x: 0.72, y: 0.28 }))
    act(() => result.current.updateBackground({ image: 'data:image/jpeg;base64,photo', type: 'image' }))
    act(() => result.current.setFormat('story'))
    expect(result.current.project).toMatchObject({
      formatId: 'story',
      width: 1080,
      height: 1920,
      background: { image: 'data:image/jpeg;base64,photo', type: 'image' },
      layers: [{ id: layerId, text: 'Keep this copy', x: 0.72, y: 0.28 }],
    })
  })

  it('keeps wallpaper and Instagram projects separate while preserving each draft', () => {
    const { result, rerender } = renderHook(({ tool }) => useCreativeProject(tool), {
      initialProps: { tool: 'wallpaper' },
    })
    act(() => result.current.addLayer())
    const wallpaperLayerId = result.current.project.layers[0].id
    act(() => result.current.updateLayer(wallpaperLayerId, { text: 'Wallpaper only' }))

    rerender({ tool: 'social' })
    expect(result.current.project.formatId).toBe('square-post')
    expect(result.current.project.layers).toHaveLength(0)
    act(() => result.current.addLayer())
    const socialLayerId = result.current.project.layers[0].id
    act(() => result.current.updateLayer(socialLayerId, { text: 'Instagram only' }))

    rerender({ tool: 'wallpaper' })
    expect(result.current.project.layers).toMatchObject([{ id: wallpaperLayerId, text: 'Wallpaper only' }])
    rerender({ tool: 'social' })
    expect(result.current.project.layers).toMatchObject([{ id: socialLayerId, text: 'Instagram only' }])
  })
})

describe('creative renderer and editor', () => {
  it('renders the selected composition at exact output dimensions', async () => {
    const canvas = document.createElement('canvas')
    const project = {
      formatId: 'square-post',
      width: 1080,
      height: 1080,
      background: { type: 'solid', color: '#222222', image: '', overlayOpacity: 0 },
      layers: [{
        id: 'headline',
        text: 'A new beginning',
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
        padding: 0.01,
        radius: 0.01,
        shadow: false,
        shadowColor: '#000000',
        shadowBlur: 0,
      }],
    }

    await expect(renderCreativeProject(canvas, project)).resolves.toMatchObject({ width: 1080, height: 1080 })
    expect(canvas.width).toBe(1080)
    expect(canvas.height).toBe(1080)
    expect(canvas.getContext('2d').fillText).toHaveBeenCalledWith('A new beginning', 0, 0)
  })

  it('uses the system fallback when a registered font cannot load', async () => {
    vi.spyOn(document.fonts, 'load').mockRejectedValue(new Error('Font unavailable'))
    const canvas = document.createElement('canvas')
    const project = {
      width: 1080,
      height: 1080,
      background: { type: 'solid', color: '#222222', image: '', overlayOpacity: 0 },
      layers: [{ id: 'one', text: 'Fallback', fontId: 'Inter', x: 0.5, y: 0.5, size: 0.06, opacity: 1, align: 'center', color: '#ffffff' }],
    }

    await expect(renderCreativeProject(canvas, project)).resolves.toMatchObject({ width: 1080 })
    expect(canvas.getContext('2d').fillText).toHaveBeenCalled()
  })

  it('honors a zero-degree gradient angle', async () => {
    const canvas = document.createElement('canvas')
    await renderCreativeProject(canvas, {
      width: 1080,
      height: 1080,
      background: { type: 'gradient', color: '#000000', endColor: '#ffffff', angle: 0, image: '', overlayOpacity: 0 },
      layers: [],
    })
    const [startX, startY, endX, endY] = canvas.getContext('2d').createLinearGradient.mock.calls[0]
    expect(startX).toBeCloseTo(540)
    expect(endX).toBeCloseTo(540)
    expect(startY).toBeGreaterThan(540)
    expect(endY).toBeLessThan(540)
  })

  it('draws the current video frame as a creative background', async () => {
    const canvas = document.createElement('canvas')
    const video = { videoWidth: 1920, videoHeight: 1080, readyState: 2 }
    await renderCreativeProject(canvas, {
      width: 1080,
      height: 1080,
      background: { type: 'video', imageFit: 'cover', imageScale: 1, imageX: 0.5, imageY: 0.5, overlayOpacity: 0 },
      layers: [],
    }, { video })
    expect(canvas.getContext('2d').drawImage).toHaveBeenCalledWith(video, -420, 0, 1920, 1080)
  })

  it('compresses uploaded images in-browser and rejects non-image files', async () => {
    class MockImage {
      naturalWidth = 4400
      naturalHeight = 2200
      onload = null

      set src(_source) {
        this.onload?.()
      }
    }
    const toDataUrl = vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue('data:image/jpeg;base64,compressed')
    vi.stubGlobal('Image', MockImage)
    const photo = new File(['image'], 'photo.png', { type: 'image/png' })

    await expect(prepareBackgroundImage(photo)).resolves.toBe('data:image/jpeg;base64,compressed')
    expect(toDataUrl).toHaveBeenCalledWith('image/jpeg', 0.84)
    await expect(prepareBackgroundImage(new File(['text'], 'notes.txt', { type: 'text/plain' }))).rejects.toThrow(/image file/i)
  })

  it('switches to the social creator and exposes keyboard-accessible positioning', async () => {
    const user = userEvent.setup()
    render(<CreativeStudio tool="social" onBack={() => {}} onSwitchTool={() => {}} />)

    expect(screen.getByRole('heading', { name: 'Instagram post & story creator' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Video' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Add text/i }))
    expect(screen.getByLabelText('Text')).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /Great Vibes/i })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Calligraphy' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Move text up' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Move text right' }))
    expect(screen.getByLabelText('Horizontal position')).toHaveValue('0.51')
    await user.selectOptions(screen.getByLabelText('Social format'), 'portrait-post')
    expect(screen.getByText('Output dimensions: 1080 × 1350 px. Positions and type scale with the frame.')).toBeInTheDocument()
  })

  it('exports the latest selected format with a matching filename', async () => {
    const user = userEvent.setup()
    let filename = ''
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:creative-test')
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function saveDownload() {
      filename = this.download
    })
    const { container } = render(<CreativeStudio tool="social" onBack={() => {}} onSwitchTool={() => {}} />)

    await user.selectOptions(screen.getByLabelText('Social format'), 'portrait-post')
    await waitFor(() => expect(container.querySelector('.creative-canvas')?.getAttribute('height')).toBe('1350'))
    await waitFor(() => expect(container.querySelector('.creative-status')).toHaveTextContent('ready'))
    await user.click(screen.getAllByRole('button', { name: 'Download PNG' })[0])

    await waitFor(() => expect(filename).toBe('taskframe-instagram-portrait-post-1080x1350.png'))
  })
})
