import { Download, Eraser } from 'lucide-react'
import { getOutputSize } from '../utils/wallpaperLayouts.js'

export default function ExportControls({ settings, onDownload, downloading, onResetData, persistenceEnabled }) {
  const size = getOutputSize(settings)
  return (
    <section className="panel export-panel" id="export" aria-labelledby="export-title">
      <div className="panel-head">
        <p className="section-kicker">Export</p>
        <h2 id="export-title">Download PNG</h2>
        <p className="panel-help">
          Exports a high-resolution image at {size.width}×{size.height}. Phone lock screens may crop around clocks and indicators; keep important text inside the safe area.
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
