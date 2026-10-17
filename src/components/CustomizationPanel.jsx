import { RotateCcw, Shuffle, Wand2 } from 'lucide-react'
import {
  ACCENT_SWATCHES,
  COMPLETED_STYLES,
  DESIGN_PRESETS,
  DIMENSION_PRESETS,
  DIVIDER_STYLES,
  FONT_OPTIONS,
  LAYOUT_OPTIONS,
} from '../constants.js'

function Field({ label, htmlFor, children }) {
  return (
    <label className="field" htmlFor={htmlFor}>
      <span>{label}</span>
      {children}
    </label>
  )
}

export default function CustomizationPanel({
  settings,
  onChange,
  onReset,
  onSurprise,
  onCycleTheme,
  onApplyPreset,
}) {
  return (
    <section className="panel" aria-labelledby="customize-title">
      <div className="panel-head">
        <p className="section-kicker">Design</p>
        <h2 id="customize-title">Customization</h2>
      </div>
      <div className="action-row">
        <button type="button" className="button ghost" onClick={onSurprise}>
          <Wand2 size={16} aria-hidden="true" />
          Surprise me
        </button>
        <button type="button" className="button ghost" onClick={() => onCycleTheme(1)}>
          <Shuffle size={16} aria-hidden="true" />
          Next theme
        </button>
        <button type="button" className="button ghost" onClick={onReset}>
          <RotateCcw size={16} aria-hidden="true" />
          Reset customization
        </button>
      </div>

      <details className="fold" open>
        <summary>Content</summary>
        <Field label="Title" htmlFor="wp-title">
          <input id="wp-title" value={settings.title} onChange={(event) => onChange({ title: event.target.value })} />
        </Field>
        <Field label="Subtitle" htmlFor="wp-subtitle">
          <input id="wp-subtitle" value={settings.subtitle} onChange={(event) => onChange({ subtitle: event.target.value })} />
        </Field>
        <Field label="Motivational line" htmlFor="wp-quote">
          <input id="wp-quote" value={settings.quote} onChange={(event) => onChange({ quote: event.target.value })} />
        </Field>
        <div className="toggle-grid">
          <label className="check">
            <input type="checkbox" checked={settings.showDate} onChange={(event) => onChange({ showDate: event.target.checked })} />
            Show date
          </label>
          <label className="check">
            <input type="checkbox" checked={settings.showCounter} onChange={(event) => onChange({ showCounter: event.target.checked })} />
            Show task counter
          </label>
          <label className="check">
            <input type="checkbox" checked={settings.showProgress} onChange={(event) => onChange({ showProgress: event.target.checked })} />
            Show progress
          </label>
        </div>
        <Field label="Completed task style" htmlFor="wp-completed">
          <select id="wp-completed" value={settings.completedStyle} onChange={(event) => onChange({ completedStyle: event.target.value })}>
            {COMPLETED_STYLES.map((option) => (
              <option key={option.id} value={option.id}>{option.label}</option>
            ))}
          </select>
        </Field>
      </details>

      <details className="fold" open>
        <summary>Visual</summary>
        <Field label="Font" htmlFor="wp-font">
          <select id="wp-font" value={settings.fontFamily} onChange={(event) => onChange({ fontFamily: event.target.value })}>
            <option value="">Theme default</option>
            {FONT_OPTIONS.map((font) => (
              <option key={font.id} value={font.id}>{font.label}</option>
            ))}
          </select>
        </Field>
        <Field label={`Type size (${Math.round(settings.fontScale * 100)}%)`} htmlFor="wp-font-scale">
          <input id="wp-font-scale" type="range" min="0.85" max="1.25" step="0.01" value={settings.fontScale} onChange={(event) => onChange({ fontScale: Number(event.target.value) })} />
        </Field>
        <Field label={`Task spacing (${Math.round(settings.taskSpacing * 100)}%)`} htmlFor="wp-spacing">
          <input id="wp-spacing" type="range" min="0.7" max="1.4" step="0.01" value={settings.taskSpacing} onChange={(event) => onChange({ taskSpacing: Number(event.target.value) })} />
        </Field>
        <Field label={`Decoration (${Math.round(settings.decorationIntensity * 100)}%)`} htmlFor="wp-decor">
          <input id="wp-decor" type="range" min="0" max="1" step="0.01" value={settings.decorationIntensity} onChange={(event) => onChange({ decorationIntensity: Number(event.target.value) })} />
        </Field>
        <Field label="Divider" htmlFor="wp-divider">
          <select id="wp-divider" value={settings.dividerStyle} onChange={(event) => onChange({ dividerStyle: event.target.value })}>
            <option value="">Theme default</option>
            {DIVIDER_STYLES.map((option) => (
              <option key={option.id} value={option.id}>{option.label}</option>
            ))}
          </select>
        </Field>
        <fieldset className="swatches">
          <legend>Accent</legend>
          {ACCENT_SWATCHES.map((color) => (
            <button
              key={color}
              type="button"
              className={`swatch ${settings.accentColor === color ? 'is-selected' : ''}`}
              style={{ background: color }}
              onClick={() => onChange({ accentColor: color })}
              aria-label={`Use accent ${color}`}
            />
          ))}
          <label className="swatch custom">
            <span className="sr-only">Custom accent</span>
            <input type="color" value={settings.accentColor || '#C4A574'} onChange={(event) => onChange({ accentColor: event.target.value })} />
          </label>
        </fieldset>
        <label className="check">
          <input
            type="checkbox"
            checked={settings.useCustomBackground}
            onChange={(event) => onChange({ useCustomBackground: event.target.checked })}
          />
          Override background color
        </label>
        {settings.useCustomBackground ? (
          <Field label="Background" htmlFor="wp-bg">
            <input id="wp-bg" type="color" value={settings.backgroundColor || '#111111'} onChange={(event) => onChange({ backgroundColor: event.target.value })} />
          </Field>
        ) : null}
      </details>

      <details className="fold" open>
        <summary>Layout and size</summary>
        <Field label="Wallpaper layout" htmlFor="wp-layout">
          <select id="wp-layout" value={settings.layout} onChange={(event) => onChange({ layout: event.target.value })}>
            <option value="">Theme default</option>
            {LAYOUT_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>{option.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Output size" htmlFor="wp-size">
          <select id="wp-size" value={settings.dimensionId} onChange={(event) => onChange({ dimensionId: event.target.value })}>
            {DIMENSION_PRESETS.map((preset) => (
              <option key={preset.id} value={preset.id}>{preset.label}</option>
            ))}
          </select>
        </Field>
        {settings.dimensionId === 'custom' ? (
          <div className="inline-fields">
            <Field label="Width" htmlFor="wp-width">
              <input id="wp-width" type="number" min="720" max="2160" value={settings.customWidth} onChange={(event) => onChange({ customWidth: Number(event.target.value) })} />
            </Field>
            <Field label="Height" htmlFor="wp-height">
              <input id="wp-height" type="number" min="1280" max="3840" value={settings.customHeight} onChange={(event) => onChange({ customHeight: Number(event.target.value) })} />
            </Field>
          </div>
        ) : null}
      </details>

      <fieldset className="presets">
        <legend>Curated presets</legend>
        <div className="preset-row">
          {DESIGN_PRESETS.map((preset) => (
            <button key={preset.id} type="button" className="chip" onClick={() => onApplyPreset(preset.id)}>
              {preset.name}
            </button>
          ))}
        </div>
      </fieldset>
    </section>
  )
}
