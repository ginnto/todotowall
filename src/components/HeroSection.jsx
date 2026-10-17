import { ArrowDownRight, Sparkles } from 'lucide-react'
import { BRAND } from '../constants.js'

export default function HeroSection({ previewCanvasRef }) {
  return (
    <section className="hero" id="top">
      <div className="hero-copy">
        <p className="eyebrow">Aesthetic task wallpaper generator</p>
        <h1>Make your everyday goals look extraordinary.</h1>
        <p className="lede">
          Turn your daily checklist into a personalized wallpaper that keeps your priorities in sight.
        </p>
        <p className="tagline">{BRAND.tagline}</p>
        <div className="hero-actions">
          <a className="button primary" href="#studio">
            Create My Wallpaper
          </a>
          <a className="button ghost" href="#themes">
            Explore Themes
            <ArrowDownRight size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
      <div className="hero-visual">
        <div className="hero-device">
          <canvas ref={previewCanvasRef} className="hero-canvas" aria-label="Sample wallpaper preview" />
        </div>
        <p className="hero-note">
          <Sparkles size={14} aria-hidden="true" />
          A static lock-screen image, composed in the browser.
        </p>
      </div>
    </section>
  )
}
