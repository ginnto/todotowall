import { Frame, Moon, Sun, Shield } from 'lucide-react'
import { BRAND } from '../constants.js'

export default function Header({ appearance, onToggleAppearance, onCreate }) {
  return (
    <header className="site-header">
      <a className="brand" href="#top">
        <span className="brand-mark" aria-hidden="true">
          <Frame size={18} />
        </span>
        <span>
          <strong>{BRAND.name}</strong>
          <em>Studio</em>
        </span>
      </a>
      <nav className="site-nav" aria-label="Primary">
        <a href="#themes">Themes</a>
        <a href="#studio">Studio</a>
        <a href="#export">Export</a>
      </nav>
      <div className="header-actions">
        <p className="local-badge">
          <Shield size={14} aria-hidden="true" />
          Works locally
        </p>
        <button
          type="button"
          className="icon-button"
          onClick={onToggleAppearance}
          aria-label={appearance === 'dark' ? 'Switch to light appearance' : 'Switch to dark appearance'}
        >
          {appearance === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button type="button" className="button primary" onClick={onCreate}>
          Create Wallpaper
        </button>
      </div>
    </header>
  )
}
