import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Copy, Download, Plus, Trash2 } from 'lucide-react'
import { CREATIVE_FORMATS, CREATIVE_FONTS, MAX_TEXT_LAYERS } from '../creative/creativeRegistry.js'
import { renderCreativeProject } from '../creative/creativeRenderer.js'
import { useCreativeProject } from '../hooks/useCreativeProject.js'
import { downloadCanvasPng } from '../utils/downloadUtils.js'
import { prepareBackgroundImage } from '../utils/imageUtils.js'
import ToolSelector from './ToolSelector.jsx'

function Field({ label, htmlFor, children }) {
  return (
    <label className="field creative-field" htmlFor={htmlFor}>
      <span>{label}</span>
      {children}
    </label>
  )
}

function safeFilename(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function CreativeStudio({ tool, active = true, onBack, onSwitchTool }) {
  const {
    project,
    selectedLayerId,
    setSelectedLayerId,
    updateBackground,
    setFormat,
    addLayer,
    updateLayer,
    duplicateLayer,
    deleteLayer,
    moveLayer,
    setCustomDimensions,
  } = useCreativeProject(tool)
  const canvasRef = useRef(null)
  const renderRevision = useRef(0)
  const projectRevision = useRef(0)
  const dragPointer = useRef(null)
  const [status, setStatus] = useState('rendering')
  const [message, setMessage] = useState('')
  const [messageTone, setMessageTone] = useState('info')
  const [exporting, setExporting] = useState(false)
  const formats = CREATIVE_FORMATS[tool]
  const selectedLayer = project.layers.find((layer) => layer.id === selectedLayerId)
  const isSocial = tool === 'social'

  useEffect(() => {
    if (!formats.some((format) => format.id === project.formatId)) {
      setFormat(formats[0].id)
    }
  }, [formats, project.formatId, setFormat])

  useEffect(() => {
    projectRevision.current += 1
  }, [project])

  useEffect(() => {
    if (!active) return undefined
    const revision = ++renderRevision.current
    let cancelled = false
    const statusTimer = window.setTimeout(() => setStatus('rendering'), 0)
    const timer = window.setTimeout(async () => {
      try {
        await renderCreativeProject(canvasRef.current, project, {
          selectedLayerId,
          isCurrent: () => !cancelled && revision === renderRevision.current,
        })
        if (!cancelled) {
          setMessage('')
          setMessageTone('info')
          setStatus('ready')
        }
      } catch (error) {
        if (!cancelled) {
          setMessage(error.message || 'The design could not be rendered.')
          setMessageTone('error')
          setStatus('error')
        }
      }
    }, 50)
    return () => {
      cancelled = true
      window.clearTimeout(statusTimer)
      window.clearTimeout(timer)
    }
  }, [active, project, selectedLayerId])

  const onCanvasPointerDown = (event) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height
    const hit = [...project.layers].reverse().find((layer) => (
      Math.abs(layer.x - x) <= 0.43 && Math.abs(layer.y - y) <= 0.12
    ))
    if (!hit) {
      setSelectedLayerId(null)
      return
    }
    setSelectedLayerId(hit.id)
    dragPointer.current = { id: hit.id, pointerId: event.pointerId }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onCanvasPointerMove = (event) => {
    const drag = dragPointer.current
    const canvas = canvasRef.current
    if (!drag || !canvas) return
    const rect = canvas.getBoundingClientRect()
    updateLayer(drag.id, {
      x: Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)),
      y: Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height)),
    })
  }

  const stopDragging = () => {
    dragPointer.current = null
  }

  const uploadImage = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    try {
      const image = await prepareBackgroundImage(file)
      updateBackground({ image, type: 'image' })
      setMessage('Image added. It remains on this device.')
      setMessageTone('success')
    } catch (error) {
      setMessage(error.message || 'The image could not be added.')
      setMessageTone('error')
    }
  }

  const nudgeLayer = (dx, dy) => {
    if (!selectedLayer) return
    updateLayer(selectedLayer.id, {
      x: Math.max(0, Math.min(1, selectedLayer.x + dx)),
      y: Math.max(0, Math.min(1, selectedLayer.y + dy)),
    })
  }

  const download = useCallback(async () => {
    if (status !== 'ready' || exporting) return
    setExporting(true)
    setMessage('')
    setMessageTone('info')
    const revision = projectRevision.current
    try {
      const canvas = document.createElement('canvas')
      const result = await renderCreativeProject(canvas, project)
      if (revision !== projectRevision.current) {
        throw new Error('The design changed while the image was being prepared. Wait for the preview and try again.')
      }
      const format = formats.find((item) => item.id === project.formatId)
      const filename = `taskframe-${isSocial ? 'instagram' : 'wallpaper'}-${safeFilename(format?.label || 'custom')}-${result.width}x${result.height}.png`
      await downloadCanvasPng(canvas, filename)
      setMessage(`Downloaded ${filename}`)
      setMessageTone('success')
    } catch (error) {
      setMessage(error.message || 'The PNG could not be exported.')
      setMessageTone('error')
    } finally {
      setExporting(false)
    }
  }, [exporting, formats, isSocial, project, status])

  const title = isSocial ? 'Instagram post & story creator' : 'Custom wallpaper creator'

  return (
    <main className="creative-page">
      <header className="creative-header">
        <button type="button" className="creative-back" onClick={onBack}>
          <ArrowLeft size={16} aria-hidden="true" />
          Task wallpaper
        </button>
        <div>
          <p className="eyebrow">TASKFRAME · CREATIVE STUDIO</p>
          <h1>{title}</h1>
        </div>
        <button type="button" className="button primary creative-download" onClick={download} disabled={status !== 'ready' || exporting}>
          <Download size={16} aria-hidden="true" />
          {exporting ? 'Preparing…' : 'Download PNG'}
        </button>
      </header>

      <ToolSelector activeTool={tool} onSelect={onSwitchTool} compact />

      <div className="creative-workspace">
        <div className="creative-controls">
          <section className="panel">
            <div className="panel-head">
              <p className="section-kicker">01 · Format</p>
              <h2>Start with a frame</h2>
            </div>
            <Field label={isSocial ? 'Social format' : 'Wallpaper size'} htmlFor="creative-format">
              <select id="creative-format" value={project.formatId} onChange={(event) => setFormat(event.target.value)}>
                {formats.map((format) => <option key={format.id} value={format.id}>{format.label} · {format.width} × {format.height}</option>)}
              </select>
            </Field>
            {project.formatId === 'custom' ? (
              <div className="creative-inline">
                <Field label="Width" htmlFor="creative-width">
                  <input id="creative-width" type="number" min="720" max="3840" value={project.width} onChange={(event) => setCustomDimensions(event.target.value, project.height)} />
                </Field>
                <Field label="Height" htmlFor="creative-height">
                  <input id="creative-height" type="number" min="720" max="3840" value={project.height} onChange={(event) => setCustomDimensions(project.width, event.target.value)} />
                </Field>
              </div>
            ) : null}
            <p className="field-hint">Output dimensions: {project.width} × {project.height} px. Positions and type scale with the frame.</p>
          </section>

          <section className="panel">
            <div className="panel-head">
              <p className="section-kicker">02 · Canvas</p>
              <h2>Set the atmosphere</h2>
            </div>
            <Field label="Background style" htmlFor="creative-bg-type">
              <select id="creative-bg-type" value={project.background.type} onChange={(event) => updateBackground({ type: event.target.value })}>
                <option value="solid">Solid color</option>
                <option value="gradient">Gradient</option>
                <option value="image">Photo</option>
              </select>
            </Field>
            <div className="creative-inline">
              <Field label="Base color" htmlFor="creative-bg-color">
                <input id="creative-bg-color" type="color" value={project.background.color} onChange={(event) => updateBackground({ color: event.target.value })} />
              </Field>
              {project.background.type === 'gradient' ? (
                <Field label="Blend color" htmlFor="creative-bg-end">
                  <input id="creative-bg-end" type="color" value={project.background.endColor} onChange={(event) => updateBackground({ endColor: event.target.value })} />
                </Field>
              ) : null}
            </div>
            {project.background.type === 'gradient' ? (
              <Field label={`Gradient angle · ${project.background.angle}°`} htmlFor="creative-gradient-angle">
                <input id="creative-gradient-angle" type="range" min="0" max="360" step="1" value={project.background.angle} onChange={(event) => updateBackground({ angle: Number(event.target.value) })} />
              </Field>
            ) : null}
            {project.background.type === 'image' ? (
              <>
                <Field label="Upload an image" htmlFor="creative-image">
                  <input id="creative-image" type="file" accept="image/*" onChange={uploadImage} />
                </Field>
                {project.background.image ? (
                  <>
                    <Field label="Image fit" htmlFor="creative-image-fit">
                      <select id="creative-image-fit" value={project.background.imageFit} onChange={(event) => updateBackground({ imageFit: event.target.value })}>
                        <option value="cover">Fill frame (crop)</option>
                        <option value="contain">Fit whole image</option>
                      </select>
                    </Field>
                    <Field label={`Image scale · ${project.background.imageScale.toFixed(2)}×`} htmlFor="creative-image-scale">
                      <input id="creative-image-scale" type="range" min="1" max="3" step="0.01" value={project.background.imageScale} onChange={(event) => updateBackground({ imageScale: Number(event.target.value) })} />
                    </Field>
                    <div className="creative-inline">
                      <Field label="Image horizontal position" htmlFor="creative-image-x">
                        <input id="creative-image-x" type="range" min="0" max="1" step="0.01" value={project.background.imageX} onChange={(event) => updateBackground({ imageX: Number(event.target.value) })} />
                      </Field>
                      <Field label="Image vertical position" htmlFor="creative-image-y">
                        <input id="creative-image-y" type="range" min="0" max="1" step="0.01" value={project.background.imageY} onChange={(event) => updateBackground({ imageY: Number(event.target.value) })} />
                      </Field>
                    </div>
                    <Field label={`Overlay · ${Math.round(project.background.overlayOpacity * 100)}%`} htmlFor="creative-overlay">
                      <input id="creative-overlay" type="range" min="0" max="0.9" step="0.01" value={project.background.overlayOpacity} onChange={(event) => updateBackground({ overlayOpacity: Number(event.target.value) })} />
                    </Field>
                    <Field label="Overlay color" htmlFor="creative-overlay-color">
                      <input id="creative-overlay-color" type="color" value={project.background.overlayColor} onChange={(event) => updateBackground({ overlayColor: event.target.value })} />
                    </Field>
                    <button type="button" className="button ghost" onClick={() => updateBackground({ image: '', type: 'gradient' })}>
                      Remove photo
                    </button>
                  </>
                ) : <p className="field-hint">Choose a photo to use as your background. Images are processed locally.</p>}
              </>
            ) : null}
          </section>

          <section className="panel">
            <div className="panel-head creative-layer-heading">
              <div>
                <p className="section-kicker">03 · Typography</p>
                <h2>Text layers</h2>
              </div>
              <button type="button" className="button primary" onClick={addLayer} disabled={project.layers.length >= MAX_TEXT_LAYERS}>
                <Plus size={16} aria-hidden="true" /> Add text
              </button>
            </div>
            {project.layers.length ? (
              <ol className="creative-layer-list" aria-label="Text layer order">
                {project.layers.map((layer, index) => (
                  <li key={layer.id}>
                    <button type="button" className={layer.id === selectedLayerId ? 'is-selected' : ''} onClick={() => setSelectedLayerId(layer.id)}>
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      {layer.text.split('\n')[0] || 'Empty text layer'}
                    </button>
                  </li>
                ))}
              </ol>
            ) : <div className="creative-empty"><p>Your canvas is ready.</p><span>Add a text layer to start composing.</span></div>}
            {selectedLayer ? (
              <div className="layer-editor">
                <div className="creative-inline">
                  <button type="button" className="button ghost" onClick={() => duplicateLayer(selectedLayer.id)} aria-label="Duplicate selected text layer">
                    <Copy size={15} aria-hidden="true" /> Duplicate
                  </button>
                  <button type="button" className="button ghost danger" onClick={() => deleteLayer(selectedLayer.id)}>
                    <Trash2 size={15} aria-hidden="true" /> Delete
                  </button>
                  <button type="button" className="icon-button" onClick={() => moveLayer(selectedLayer.id, -1)} aria-label="Move text layer backward"><ArrowDown size={16} /></button>
                  <button type="button" className="icon-button" onClick={() => moveLayer(selectedLayer.id, 1)} aria-label="Move text layer forward"><ArrowUp size={16} /></button>
                </div>
                <Field label="Text" htmlFor="creative-layer-text">
                  <textarea id="creative-layer-text" rows="3" maxLength="500" value={selectedLayer.text} onChange={(event) => updateLayer(selectedLayer.id, { text: event.target.value })} />
                </Field>
                <Field label="Font family" htmlFor="creative-font">
                  <select id="creative-font" value={selectedLayer.fontId} onChange={(event) => updateLayer(selectedLayer.id, { fontId: event.target.value })}>
                    {CREATIVE_FONTS.map((font) => <option key={font.id} value={font.id}>{font.label}</option>)}
                  </select>
                </Field>
                <Field label={`Font size · ${Math.round(selectedLayer.size * 100)}% of canvas width`} htmlFor="creative-font-size">
                  <input id="creative-font-size" type="range" min="0.025" max="0.14" step="0.001" value={selectedLayer.size} onChange={(event) => updateLayer(selectedLayer.id, { size: Number(event.target.value) })} />
                </Field>
                <div className="creative-inline">
                  <Field label="Text color" htmlFor="creative-text-color">
                    <input id="creative-text-color" type="color" value={selectedLayer.color} onChange={(event) => updateLayer(selectedLayer.id, { color: event.target.value })} />
                  </Field>
                  <Field label="Alignment" htmlFor="creative-align">
                    <select id="creative-align" value={selectedLayer.align} onChange={(event) => updateLayer(selectedLayer.id, { align: event.target.value })}>
                      <option value="left">Left</option><option value="center">Center</option><option value="right">Right</option>
                    </select>
                  </Field>
                </div>
                <Field label={`Opacity · ${Math.round(selectedLayer.opacity * 100)}%`} htmlFor="creative-text-opacity">
                  <input id="creative-text-opacity" type="range" min="0" max="1" step="0.01" value={selectedLayer.opacity} onChange={(event) => updateLayer(selectedLayer.id, { opacity: Number(event.target.value) })} />
                </Field>
                <div className="creative-inline">
                  <Field label="Horizontal position" htmlFor="creative-layer-x">
                    <input id="creative-layer-x" type="range" min="0" max="1" step="0.005" value={selectedLayer.x} onChange={(event) => updateLayer(selectedLayer.id, { x: Number(event.target.value) })} />
                  </Field>
                  <Field label="Vertical position" htmlFor="creative-layer-y">
                    <input id="creative-layer-y" type="range" min="0" max="1" step="0.005" value={selectedLayer.y} onChange={(event) => updateLayer(selectedLayer.id, { y: Number(event.target.value) })} />
                  </Field>
                </div>
                <div className="nudge-controls" aria-label="Nudge text position">
                  <span>Fine position</span>
                  <button type="button" className="icon-button" onClick={() => nudgeLayer(0, -0.01)} aria-label="Move text up"><ArrowUp size={16} /></button>
                  <button type="button" className="icon-button" onClick={() => nudgeLayer(-0.01, 0)} aria-label="Move text left"><ArrowLeft size={16} /></button>
                  <button type="button" className="icon-button" onClick={() => nudgeLayer(0, 0.01)} aria-label="Move text down"><ArrowDown size={16} /></button>
                  <button type="button" className="icon-button" onClick={() => nudgeLayer(0.01, 0)} aria-label="Move text right"><ArrowRight size={16} /></button>
                </div>
                <Field label={`Rotation · ${selectedLayer.rotation}°`} htmlFor="creative-rotation">
                  <input id="creative-rotation" type="range" min="-180" max="180" step="1" value={selectedLayer.rotation} onChange={(event) => updateLayer(selectedLayer.id, { rotation: Number(event.target.value) })} />
                </Field>
                <div className="creative-inline">
                  <Field label="Letter spacing" htmlFor="creative-letter-spacing">
                    <input id="creative-letter-spacing" type="range" min="0" max="0.015" step="0.0005" value={selectedLayer.letterSpacing} onChange={(event) => updateLayer(selectedLayer.id, { letterSpacing: Number(event.target.value) })} />
                  </Field>
                  <Field label="Line height" htmlFor="creative-line-height">
                    <input id="creative-line-height" type="range" min="0.8" max="2" step="0.05" value={selectedLayer.lineHeight} onChange={(event) => updateLayer(selectedLayer.id, { lineHeight: Number(event.target.value) })} />
                  </Field>
                </div>
                <div className="creative-inline">
                  <Field label="Text backing color" htmlFor="creative-layer-bg">
                    <input id="creative-layer-bg" type="color" value={selectedLayer.backgroundColor} onChange={(event) => updateLayer(selectedLayer.id, { backgroundColor: event.target.value })} />
                  </Field>
                  <Field label={`Backing opacity · ${Math.round(selectedLayer.backgroundOpacity * 100)}%`} htmlFor="creative-layer-bg-opacity">
                    <input id="creative-layer-bg-opacity" type="range" min="0" max="1" step="0.01" value={selectedLayer.backgroundOpacity} onChange={(event) => updateLayer(selectedLayer.id, { backgroundOpacity: Number(event.target.value) })} />
                  </Field>
                </div>
                <div className="creative-inline">
                  <Field label="Backing padding" htmlFor="creative-padding">
                    <input id="creative-padding" type="range" min="0" max="0.06" step="0.002" value={selectedLayer.padding} onChange={(event) => updateLayer(selectedLayer.id, { padding: Number(event.target.value) })} />
                  </Field>
                  <Field label="Corner roundness" htmlFor="creative-radius">
                    <input id="creative-radius" type="range" min="0" max="0.04" step="0.002" value={selectedLayer.radius} onChange={(event) => updateLayer(selectedLayer.id, { radius: Number(event.target.value) })} />
                  </Field>
                </div>
                <div className="creative-inline">
                  <label className="check"><input type="checkbox" checked={selectedLayer.shadow} onChange={(event) => updateLayer(selectedLayer.id, { shadow: event.target.checked })} /> Text shadow</label>
                  {selectedLayer.shadow ? (
                    <>
                      <Field label="Shadow color" htmlFor="creative-shadow-color">
                        <input id="creative-shadow-color" type="color" value={selectedLayer.shadowColor} onChange={(event) => updateLayer(selectedLayer.id, { shadowColor: event.target.value })} />
                      </Field>
                      <Field label="Shadow softness" htmlFor="creative-shadow-blur">
                        <input id="creative-shadow-blur" type="range" min="0" max="0.05" step="0.002" value={selectedLayer.shadowBlur} onChange={(event) => updateLayer(selectedLayer.id, { shadowBlur: Number(event.target.value) })} />
                      </Field>
                    </>
                  ) : null}
                </div>
              </div>
            ) : null}
          </section>
        </div>

        <aside className="creative-preview-column">
          <section className="panel creative-preview-panel">
            <div className="panel-head creative-preview-title">
              <div><p className="section-kicker">Live preview</p><h2>{status === 'rendering' ? 'Composing…' : `${project.width} × ${project.height}`}</h2></div>
              <span className={`creative-status ${status}`}>{status}</span>
            </div>
            <div className="creative-canvas-wrap" style={{ aspectRatio: `${project.width} / ${project.height}` }}>
              <canvas
                ref={canvasRef}
                className="creative-canvas"
                aria-label={`${title} canvas preview`}
                onPointerDown={onCanvasPointerDown}
                onPointerMove={onCanvasPointerMove}
                onPointerUp={stopDragging}
                onPointerCancel={stopDragging}
                onLostPointerCapture={stopDragging}
              />
              {!project.layers.length ? <span className="creative-canvas-hint">Your composition begins here</span> : null}
            </div>
            {message ? <p className={messageTone === 'error' ? 'field-error' : 'creative-message'} role={messageTone === 'error' ? 'alert' : 'status'}>{message}</p> : null}
            <div className="creative-preview-footer">
              <p>Drag a text layer to position it, or use the controls for precise placement.</p>
              <button type="button" className="button primary" onClick={download} disabled={status !== 'ready' || exporting}>
                <Download size={16} aria-hidden="true" />{exporting ? 'Preparing…' : 'Download PNG'}
              </button>
            </div>
          </section>
        </aside>
      </div>
    </main>
  )
}
