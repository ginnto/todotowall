import DeviceFrame from './DeviceFrame.jsx'

export default function WallpaperPreview({
  canvasRef,
  aspectRatio,
  status,
  warning,
  empty,
  isDesktop,
}) {
  const label = isDesktop ? 'Desktop wallpaper preview' : 'Mobile wallpaper preview'
  return (
    <section className="preview-column" aria-labelledby="preview-title">
      <div className="panel-head">
        <p className="section-kicker">Preview</p>
        <h2 id="preview-title">{isDesktop ? 'Desktop wallpaper' : 'Live lock screen'}</h2>
        <p className="panel-help">This is the wallpaper at the selected size. Downloaded images do not change when you edit the list later.</p>
      </div>
      <div className="preview-stage">
        <DeviceFrame aspectRatio={aspectRatio} label={label} isDesktop={isDesktop}>
          <canvas ref={canvasRef} className="wallpaper-canvas" />
          {status === 'rendering' ? <div className="preview-status">Composing…</div> : null}
          {status === 'error' ? <div className="preview-status error">Preview could not be drawn.</div> : null}
        </DeviceFrame>
        {empty ? <p className="preview-empty">Your frame is ready. Add tasks to fill it.</p> : null}
        {warning ? <p className="preview-warning">{warning}</p> : null}
      </div>
    </section>
  )
}
