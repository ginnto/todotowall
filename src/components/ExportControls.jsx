import { Download, Eraser } from 'lucide-react'
import { getOutputSize } from '../utils/wallpaperLayouts.js'

export default function ExportControls({
  settings,
  onDownload,
  downloading,
  onResetData,
  persistenceEnabled,
  onSelectSize,
}) {
  const size = getOutputSize(settings)
  return (
    <section className="panel export-panel" id="export" aria-labelledby="export-title">
      <div className="wallpaper-size-picker" aria-label="Choose wallpaper orientation">
        <button
          type="button"
          className={`size-choice ${settings.dimensionId !== 'desktop' ? 'is-selected' : ''}`}
          onClick={() => onSelectSize('standard')}
          aria-pressed={settings.dimensionId !== 'desktop'}
        >
          <span className="size-icon phone-icon" aria-hidden="true" />
          <span><strong>Phone</strong><small>Portrait · 1080 × 2400</small></span>
        </button>
        <button
          type="button"
          className={`size-choice ${settings.dimensionId === 'desktop' ? 'is-selected' : ''}`}
          onClick={() => onSelectSize('desktop')}
          aria-pressed={settings.dimensionId === 'desktop'}
          aria-label="Desktop landscape 1920 by 1080"
        >
          <span className="size-icon desktop-icon" aria-hidden="true" />
          <span><strong>Desktop</strong><small>Landscape · 1920 × 1080</small></span>
        </button>
      </div>
      <div className="panel-head">
        <p className="section-kicker">Export</p>
        <h2 id="export-title">Download PNG</h2>
        <p className="panel-help">
          Exports a high-resolution image at {size.width}×{size.height}. Keep important text away from the edges where your screen may crop it.
        </p>
      </div>
      <button type="button" className="button primary wide" onClick={onDownload} disabled={downloading}>
        <Download size={16} aria-hidden="true" />
        {downloading ? 'Preparing file…' : 'Download wallpaper'}
      </button>
      <p className="privacy-note">
        Tasks, themes, and preferences stay in this browser. Nothing is uploaded to a server.
        {persistenceEnabled ? ' Local storage is available on this device.' : ' Local storage is unavailable, so nothing will persist after refresh.'}
      </p>
      <button type="button" className="button ghost" onClick={onResetData}>
        <Eraser size={16} aria-hidden="true" />
        Reset saved data
      </button>
    </section>
  )
}
