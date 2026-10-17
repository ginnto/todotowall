import { THEMES } from '../themes/themeRegistry.js'

export default function ThemeGallery({ selectedId, onSelect }) {
  return (
    <section className="panel" id="themes" aria-labelledby="theme-gallery-title">
      <div className="panel-head">
        <p className="section-kicker">Themes</p>
        <h2 id="theme-gallery-title">Visual identities</h2>
        <p className="panel-help">Each style has its own composition, type, and decoration — not just a color swap.</p>
      </div>
      <ul className="theme-grid">
        {THEMES.map((theme) => {
          const selected = theme.id === selectedId
          return (
            <li key={theme.id}>
              <button
                type="button"
                className={`theme-card ${selected ? 'is-selected' : ''}`}
                onClick={() => onSelect(theme.id)}
                aria-pressed={selected}
              >
                <span
                  className="theme-thumb"
                  style={{
                    background: `linear-gradient(160deg, ${theme.background.join(',')})`,
                    color: theme.accent,
                  }}
                  aria-hidden="true"
                >
                  <span />
                  <span />
                  <span />
                </span>
                <strong>{theme.name}</strong>
                <em>{theme.description}</em>
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
