import DeviceFrame from './DeviceFrame.jsx'

export default function WallpaperPreview({
  canvasRef,
  aspectRatio,
  status,
  warning,
  empty,
}) {
  return (
    <section className="preview-column" aria-labelledby="preview-title">
      <div className="panel-head">
        <p className="section-kicker">Preview</p>
        <h2 id="preview-title">Live lock screen</h2>
        <p className="panel-help">This is the actual wallpaper, scaled into a phone frame. Checking a downloaded image on your phone will not update this studio.</p>
      </div>
      <div className="preview-stage">
        <DeviceFrame aspectRatio={aspectRatio} label="Mobile wallpaper preview">
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
