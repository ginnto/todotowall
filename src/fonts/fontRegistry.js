const SYSTEM_FONTS = [
  { id: 'system-ui', label: 'Modern System', category: 'Minimal', stack: 'system-ui, "Segoe UI", sans-serif' },
  { id: 'Georgia', label: 'Classic Editorial', category: 'Editorial', stack: 'Georgia, "Times New Roman", serif' },
  { id: 'Segoe UI', label: 'Clean Rounded', category: 'Professional', stack: '"Segoe UI", system-ui, sans-serif' },
  { id: 'Arial', label: 'Classic Sans', category: 'Professional', stack: 'Arial, sans-serif' },
]

const GOOGLE_FONTS = [
  { id: 'Caveat', label: 'Caveat · relaxed handwriting', category: 'Handwriting', fallback: 'cursive' },
  { id: 'Caveat Brush', label: 'Caveat Brush · bold handwritten', category: 'Handwriting', fallback: 'cursive', weight: 400, weights: '400' },
  { id: 'Patrick Hand', label: 'Patrick Hand · friendly notes', category: 'Handwriting', fallback: 'cursive', weight: 400, weights: '400' },
  { id: 'Kalam', label: 'Kalam · warm handwritten', category: 'Handwriting', fallback: 'cursive', weight: 400, weights: '400' },
  { id: 'Shadows Into Light', label: 'Shadows Into Light · fine marker', category: 'Handwriting', fallback: 'cursive', weight: 400, weights: '400' },
  { id: 'Architects Daughter', label: 'Architects Daughter · neat notes', category: 'Handwriting', fallback: 'cursive', weight: 400, weights: '400' },
  { id: 'Indie Flower', label: 'Indie Flower · playful journal', category: 'Handwriting', fallback: 'cursive', weight: 400, weights: '400' },
  { id: 'Homemade Apple', label: 'Homemade Apple · inked note', category: 'Handwriting', fallback: 'cursive', weight: 400, weights: '400' },
  { id: 'Gloria Hallelujah', label: 'Gloria Hallelujah · bold notebook', category: 'Handwriting', fallback: 'cursive', weight: 400, weights: '400' },
  { id: 'Reenie Beanie', label: 'Reenie Beanie · loose penmanship', category: 'Handwriting', fallback: 'cursive', weight: 400, weights: '400' },
  { id: 'Rock Salt', label: 'Rock Salt · textured marker', category: 'Handwriting', fallback: 'cursive', weight: 400, weights: '400' },
  { id: 'Permanent Marker', label: 'Permanent Marker · sign painter', category: 'Handwriting', fallback: 'cursive', weight: 400, weights: '400' },
  { id: 'Nothing You Could Do', label: 'Nothing You Could Do · quick scribble', category: 'Handwriting', fallback: 'cursive', weight: 400, weights: '400' },
  { id: 'Gochi Hand', label: 'Gochi Hand · friendly marker', category: 'Handwriting', fallback: 'cursive', weight: 400, weights: '400' },
  { id: 'Handlee', label: 'Handlee · tidy handwritten', category: 'Handwriting', fallback: 'cursive', weight: 400, weights: '400' },
  { id: 'Short Stack', label: 'Short Stack · rounded note', category: 'Handwriting', fallback: 'cursive', weight: 400, weights: '400' },
  { id: 'Neucha', label: 'Neucha · casual notebook', category: 'Handwriting', fallback: 'cursive', weight: 400, weights: '400' },
  { id: 'Yomogi', label: 'Yomogi · airy handwritten', category: 'Handwriting', fallback: 'cursive', weight: 400, weights: '400' },
  { id: 'Great Vibes', label: 'Great Vibes · formal calligraphy', category: 'Calligraphy', fallback: 'cursive', weight: 400, weights: '400' },
  { id: 'Allura', label: 'Allura · elegant signature', category: 'Calligraphy', fallback: 'cursive', weight: 400, weights: '400' },
  { id: 'Dancing Script', label: 'Dancing Script · flowing script', category: 'Calligraphy', fallback: 'cursive' },
  { id: 'Parisienne', label: 'Parisienne · romantic script', category: 'Calligraphy', fallback: 'cursive', weight: 400, weights: '400' },
  { id: 'Sacramento', label: 'Sacramento · fine signature', category: 'Calligraphy', fallback: 'cursive', weight: 400, weights: '400' },
  { id: 'Satisfy', label: 'Satisfy · expressive script', category: 'Calligraphy', fallback: 'cursive', weight: 400, weights: '400' },
  { id: 'Marck Script', label: 'Marck Script · casual calligraphy', category: 'Calligraphy', fallback: 'cursive', weight: 400, weights: '400' },
  { id: 'Tangerine', label: 'Tangerine · delicate flourish', category: 'Calligraphy', fallback: 'cursive', weight: 400, weights: '400' },
  { id: 'Alex Brush', label: 'Alex Brush · elegant brush script', category: 'Calligraphy', fallback: 'cursive', weight: 400, weights: '400' },
  { id: 'Pinyon Script', label: 'Pinyon Script · formal invitation', category: 'Calligraphy', fallback: 'cursive', weight: 400, weights: '400' },
  { id: 'Italianno', label: 'Italianno · graceful flourish', category: 'Calligraphy', fallback: 'cursive', weight: 400, weights: '400' },
  { id: 'Mr De Haviland', label: 'Mr De Haviland · vintage signature', category: 'Calligraphy', fallback: 'cursive', weight: 400, weights: '400' },
  { id: 'Monsieur La Doulaise', label: 'Monsieur La Doulaise · ornamental script', category: 'Calligraphy', fallback: 'cursive', weight: 400, weights: '400' },
  { id: 'Rouge Script', label: 'Rouge Script · romantic pen', category: 'Calligraphy', fallback: 'cursive', weight: 400, weights: '400' },
  { id: 'Clicker Script', label: 'Clicker Script · polished signature', category: 'Calligraphy', fallback: 'cursive', weight: 400, weights: '400' },
  { id: 'Ephesis', label: 'Ephesis · delicate handwritten script', category: 'Calligraphy', fallback: 'cursive', weight: 400, weights: '400' },
  { id: 'Comfortaa', label: 'Comfortaa · soft geometric', category: 'Cozy', fallback: 'system-ui, sans-serif' },
  { id: 'Quicksand', label: 'Quicksand · gentle rounded', category: 'Cozy', fallback: 'system-ui, sans-serif' },
  { id: 'Nunito', label: 'Nunito · warm and friendly', category: 'Cozy', fallback: 'system-ui, sans-serif' },
  { id: 'Lora', label: 'Lora · cozy reading serif', category: 'Cozy', fallback: 'Georgia, serif' },
  { id: 'Fraunces', label: 'Fraunces · soft vintage serif', category: 'Cozy', fallback: 'Georgia, serif' },
  { id: 'Josefin Sans', label: 'Josefin Sans · airy and gentle', category: 'Cozy', fallback: 'system-ui, sans-serif' },
  { id: 'Merriweather', label: 'Merriweather · fireside reading', category: 'Cozy', fallback: 'Georgia, serif' },
  { id: 'Crimson Pro', label: 'Crimson Pro · relaxed book serif', category: 'Cozy', fallback: 'Georgia, serif' },
  { id: 'Alegreya', label: 'Alegreya · literary warmth', category: 'Cozy', fallback: 'Georgia, serif' },
  { id: 'Vollkorn', label: 'Vollkorn · soft old-style serif', category: 'Cozy', fallback: 'Georgia, serif' },
  { id: 'Zilla Slab', label: 'Zilla Slab · friendly slab', category: 'Cozy', fallback: 'Georgia, serif' },
  { id: 'Dosis', label: 'Dosis · soft rounded sans', category: 'Cozy', fallback: 'system-ui, sans-serif' },
  { id: 'Cabin', label: 'Cabin · warm humanist sans', category: 'Cozy', fallback: 'system-ui, sans-serif' },
  { id: 'Rubik', label: 'Rubik · cozy rounded geometry', category: 'Cozy', fallback: 'system-ui, sans-serif' },
  { id: 'Inter', label: 'Inter · crisp neutral', category: 'Minimal', fallback: 'system-ui, sans-serif' },
  { id: 'DM Sans', label: 'DM Sans · quiet modern', category: 'Minimal', fallback: 'system-ui, sans-serif' },
  { id: 'Manrope', label: 'Manrope · refined geometric', category: 'Minimal', fallback: 'system-ui, sans-serif' },
  { id: 'Outfit', label: 'Outfit · contemporary minimal', category: 'Minimal', fallback: 'system-ui, sans-serif' },
  { id: 'Jost', label: 'Jost · understated modern', category: 'Minimal', fallback: 'system-ui, sans-serif' },
  { id: 'Urbanist', label: 'Urbanist · polished minimal', category: 'Minimal', fallback: 'system-ui, sans-serif' },
  { id: 'Work Sans', label: 'Work Sans · simple and clear', category: 'Minimal', fallback: 'system-ui, sans-serif' },
  { id: 'Sora', label: 'Sora · sculpted modern', category: 'Minimal', fallback: 'system-ui, sans-serif' },
  { id: 'Figtree', label: 'Figtree · fresh minimal', category: 'Minimal', fallback: 'system-ui, sans-serif' },
  { id: 'Albert Sans', label: 'Albert Sans · balanced geometric', category: 'Minimal', fallback: 'system-ui, sans-serif' },
  { id: 'Epilogue', label: 'Epilogue · clean contemporary', category: 'Minimal', fallback: 'system-ui, sans-serif' },
  { id: 'Onest', label: 'Onest · modern quiet sans', category: 'Minimal', fallback: 'system-ui, sans-serif' },
  { id: 'Assistant', label: 'Assistant · open and readable', category: 'Minimal', fallback: 'system-ui, sans-serif' },
  { id: 'Oxygen', label: 'Oxygen · crisp screen sans', category: 'Minimal', fallback: 'system-ui, sans-serif' },
  { id: 'Karla', label: 'Karla · understated character', category: 'Minimal', fallback: 'system-ui, sans-serif' },
  { id: 'Libre Franklin', label: 'Libre Franklin · refined neutral', category: 'Minimal', fallback: 'system-ui, sans-serif' },
  { id: 'Plus Jakarta Sans', label: 'Plus Jakarta Sans · polished', category: 'Professional', fallback: 'system-ui, sans-serif' },
  { id: 'Montserrat', label: 'Montserrat · confident modern', category: 'Professional', fallback: 'system-ui, sans-serif' },
  { id: 'Lato', label: 'Lato · approachable professional', category: 'Professional', fallback: 'system-ui, sans-serif' },
  { id: 'Source Sans 3', label: 'Source Sans 3 · clear utility', category: 'Professional', fallback: 'system-ui, sans-serif' },
  { id: 'IBM Plex Sans', label: 'IBM Plex Sans · precise humanist', category: 'Professional', fallback: 'system-ui, sans-serif' },
  { id: 'Roboto', label: 'Roboto · dependable modern', category: 'Professional', fallback: 'system-ui, sans-serif' },
  { id: 'Open Sans', label: 'Open Sans · clear and familiar', category: 'Professional', fallback: 'system-ui, sans-serif' },
  { id: 'Public Sans', label: 'Public Sans · confident clarity', category: 'Professional', fallback: 'system-ui, sans-serif' },
  { id: 'Fira Sans', label: 'Fira Sans · precise and human', category: 'Professional', fallback: 'system-ui, sans-serif' },
  { id: 'Nunito Sans', label: 'Nunito Sans · friendly business', category: 'Professional', fallback: 'system-ui, sans-serif' },
  { id: 'Red Hat Display', label: 'Red Hat Display · polished display', category: 'Professional', fallback: 'system-ui, sans-serif' },
  { id: 'Lexend', label: 'Lexend · modern readable', category: 'Professional', fallback: 'system-ui, sans-serif' },
  { id: 'Ubuntu', label: 'Ubuntu · humanist contemporary', category: 'Professional', fallback: 'system-ui, sans-serif' },
  { id: 'Playfair Display', label: 'Playfair Display · luxe editorial', category: 'Editorial', fallback: 'Georgia, serif' },
  { id: 'Cormorant Garamond', label: 'Cormorant Garamond · fashion serif', category: 'Editorial', fallback: 'Georgia, serif' },
  { id: 'DM Serif Display', label: 'DM Serif Display · expressive headline', category: 'Editorial', fallback: 'Georgia, serif', weight: 400, weights: '400' },
  { id: 'Libre Baskerville', label: 'Libre Baskerville · literary serif', category: 'Editorial', fallback: 'Georgia, serif', weights: '400;700' },
  { id: 'EB Garamond', label: 'EB Garamond · timeless book serif', category: 'Editorial', fallback: 'Georgia, serif' },
  { id: 'Bodoni Moda', label: 'Bodoni Moda · high-fashion contrast', category: 'Editorial', fallback: 'Georgia, serif' },
  { id: 'Abril Fatface', label: 'Abril Fatface · dramatic cover', category: 'Editorial', fallback: 'Georgia, serif', weight: 400, weights: '400' },
  { id: 'Spectral', label: 'Spectral · contemporary literature', category: 'Editorial', fallback: 'Georgia, serif' },
  { id: 'Prata', label: 'Prata · refined luxury serif', category: 'Editorial', fallback: 'Georgia, serif', weight: 400, weights: '400' },
  { id: 'Antic Didone', label: 'Antic Didone · delicate fashion type', category: 'Editorial', fallback: 'Georgia, serif', weight: 400, weights: '400' },
  { id: 'Cormorant Infant', label: 'Cormorant Infant · soft classic serif', category: 'Editorial', fallback: 'Georgia, serif' },
  { id: 'Bebas Neue', label: 'Bebas Neue · vintage poster', category: 'Retro', fallback: 'Impact, sans-serif', weight: 400, weights: '400' },
  { id: 'Righteous', label: 'Righteous · retro rounded', category: 'Retro', fallback: 'system-ui, sans-serif', weight: 400, weights: '400' },
  { id: 'Bungee', label: 'Bungee · bold arcade', category: 'Retro', fallback: 'Impact, sans-serif', weight: 400, weights: '400' },
  { id: 'Press Start 2P', label: 'Press Start 2P · pixel arcade', category: 'Retro', fallback: 'monospace', weight: 400, weights: '400' },
  { id: 'Special Elite', label: 'Special Elite · typewriter', category: 'Retro', fallback: 'monospace', weight: 400, weights: '400' },
  { id: 'Space Grotesk', label: 'Space Grotesk · contemporary display', category: 'Retro', fallback: 'system-ui, sans-serif' },
  { id: 'JetBrains Mono', label: 'JetBrains Mono · technical mono', category: 'Retro', fallback: 'ui-monospace, monospace' },
  { id: 'IBM Plex Mono', label: 'IBM Plex Mono · editorial mono', category: 'Retro', fallback: 'ui-monospace, monospace' },
  { id: 'Anton', label: 'Anton · bold vintage headline', category: 'Retro', fallback: 'Impact, sans-serif', weight: 400, weights: '400' },
  { id: 'Oswald', label: 'Oswald · condensed poster type', category: 'Retro', fallback: 'Impact, sans-serif' },
  { id: 'Archivo Black', label: 'Archivo Black · chunky print', category: 'Retro', fallback: 'Impact, sans-serif', weight: 400, weights: '400' },
  { id: 'Alfa Slab One', label: 'Alfa Slab One · classic slab poster', category: 'Retro', fallback: 'Georgia, serif', weight: 400, weights: '400' },
  { id: 'Staatliches', label: 'Staatliches · vintage signage', category: 'Retro', fallback: 'Impact, sans-serif', weight: 400, weights: '400' },
  { id: 'Unbounded', label: 'Unbounded · futuristic display', category: 'Retro', fallback: 'system-ui, sans-serif' },
  { id: 'Silkscreen', label: 'Silkscreen · pixel nostalgia', category: 'Retro', fallback: 'monospace', weight: 400, weights: '400' },
  { id: 'Orbitron', label: 'Orbitron · retro-future console', category: 'Retro', fallback: 'monospace' },
  { id: 'VT323', label: 'VT323 · vintage terminal', category: 'Retro', fallback: 'monospace', weight: 400, weights: '400' },
  { id: 'Changa One', label: 'Changa One · playful retro display', category: 'Retro', fallback: 'Impact, sans-serif', weight: 400, weights: '400' },
  { id: 'Russo One', label: 'Russo One · strong retro sport', category: 'Retro', fallback: 'system-ui, sans-serif', weight: 400, weights: '400' },
]

export const FONT_CATEGORIES = [
  'Handwriting',
  'Calligraphy',
  'Cozy',
  'Minimal',
  'Professional',
  'Editorial',
  'Retro',
]

export const FONT_REGISTRY = [
  ...SYSTEM_FONTS.map((font) => ({
    ...font,
    family: font.id,
    fallback: font.stack.slice(font.stack.indexOf(',') + 1).trim(),
    weight: 600,
    source: 'system',
  })),
  ...GOOGLE_FONTS.map((font) => ({
    ...font,
    family: font.id,
    stack: `"${font.id}", ${font.fallback}`,
    weight: font.weight || 600,
    weights: font.weights || '400;500;600;700',
    source: 'google',
  })),
]

export const FONT_OPTIONS = FONT_REGISTRY.map(({ id, label, category, stack }) => ({
  id,
  label,
  category,
  stack,
}))

export const FONT_LOAD_SPECS = FONT_REGISTRY
  .filter((font) => font.source === 'google')
  .map((font) => `${font.weight} 48px "${font.family}"`)

const loadedFontIds = new Set()
const pendingStylesheets = new Map()

export async function ensureGoogleFontsLoaded(fontIds) {
  if (typeof document === 'undefined') return
  const fonts = fontIds
    .map((id) => FONT_REGISTRY.find((font) => font.id === id))
    .filter((font) => font?.source === 'google' && !loadedFontIds.has(font.id))
  const missing = fonts.filter((font) => !pendingStylesheets.has(font.id))

  if (missing.length) {
    const families = missing
      .map((font) => `family=${encodeURIComponent(font.id).replace(/%20/g, '+')}:wght@${font.weights}`)
      .join('&')
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = `https://fonts.googleapis.com/css2?${families}&display=swap`
    const stylesheetLoaded = new Promise((resolve) => {
      link.onload = () => resolve(true)
      link.onerror = () => resolve(false)
    })
    missing.forEach((font) => pendingStylesheets.set(font.id, stylesheetLoaded))
    document.head.appendChild(link)
    const loaded = await stylesheetLoaded
    missing.forEach((font) => {
      pendingStylesheets.delete(font.id)
      if (loaded) loadedFontIds.add(font.id)
    })
  }

  const activeRequests = fonts
    .map((font) => pendingStylesheets.get(font.id))
    .filter(Boolean)
  await Promise.all(activeRequests)
}
