import { FEATURED_THEME_IDS } from '../constants.js'
import { getTheme } from '../themes/themeRegistry.js'

export default function ThemeGallery({ selectedId, onSelect }) {
  const featuredThemes = FEATURED_THEME_IDS.map(getTheme)

  return (
    <section className="panel" id="themes" aria-labelledby="theme-gallery-title">
      <div className="panel-head">
        <p className="section-kicker">Themes</p>
        <h2 id="theme-gallery-title">Three signature designs</h2>
        <p className="panel-help">Choose a complete look, then make it yours.</p>
      </div>
      <ul className="theme-grid">
        {featuredThemes.map((theme) => {
          const selected = theme.id === selectedId
          return (
            <li key={theme.id}>
              <button
                type="button"
                className={`theme-card theme-card-${theme.id} ${selected ? 'is-selected' : ''}`}
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
