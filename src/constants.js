export const BRAND = {
  name: 'TASKFRAME',
  tagline: 'Turn your plans into your perspective.',
  altTagline: 'Your day. Your design. Your lock screen.',
}

export const STORAGE_KEYS = {
  tasks: 'taskframe.tasks',
  settings: 'taskframe.settings',
  appearance: 'taskframe.appearance',
  history: 'taskframe.history',
}

export const MAX_TASKS = 24
export const MAX_TASK_LENGTH = 140
export const HISTORY_LIMIT = 8

export const DIMENSION_PRESETS = [
  { id: 'standard', label: 'Standard portrait', width: 1080, height: 2400 },
  { id: 'fullhd', label: 'Full HD portrait', width: 1080, height: 1920 },
  { id: 'desktop', label: 'Desktop landscape', width: 1920, height: 1080 },
  { id: 'custom', label: 'Custom', width: 1080, height: 2400 },
]

export const FEATURED_THEME_IDS = ['minimal-paper', 'soft-gradient', 'midnight-terminal']

export const FONT_OPTIONS = [
  { id: 'system-ui', label: 'Modern Sans', stack: 'system-ui, "Segoe UI", sans-serif' },
  { id: 'Georgia', label: 'Editorial Serif', stack: 'Georgia, "Times New Roman", serif' },
  { id: 'Segoe UI', label: 'Clean Rounded', stack: '"Segoe UI", system-ui, sans-serif' },
  { id: 'Arial', label: 'Classic Sans', stack: 'Arial, sans-serif' },
  { id: 'Manrope', label: 'Manrope', stack: 'Manrope, system-ui, sans-serif' },
  { id: 'Space Grotesk', label: 'Space Grotesk', stack: '"Space Grotesk", system-ui, sans-serif' },
  { id: 'JetBrains Mono', label: 'JetBrains Mono', stack: '"JetBrains Mono", ui-monospace, monospace' },
  { id: 'IBM Plex Mono', label: 'IBM Plex Mono', stack: '"IBM Plex Mono", ui-monospace, monospace' },
]

export const FONT_LOAD_SPECS = FONT_OPTIONS
  .filter((font) => !['system-ui', 'Georgia', 'Segoe UI', 'Arial'].includes(font.id))
  .map((font) => `600 48px "${font.id}"`)

export const LAYOUT_OPTIONS = [
  { id: 'compact', label: 'Compact checklist' },
  { id: 'spacious', label: 'Spacious checklist' },
  { id: 'editorial', label: 'Centered editorial' },
  { id: 'top-aligned', label: 'Top-aligned productivity' },
]

export const COMPLETED_STYLES = [
  { id: 'checked', label: 'Checked' },
  { id: 'strikethrough', label: 'Strikethrough' },
  { id: 'dimmed', label: 'Dimmed' },
  { id: 'hidden', label: 'Hide completed' },
]

export const DIVIDER_STYLES = [
  { id: 'none', label: 'None' },
  { id: 'line', label: 'Hairline' },
  { id: 'thick', label: 'Bold rule' },
  { id: 'dots', label: 'Dotted' },
]

export const ACCENT_SWATCHES = [
  '#C4A574',
  '#7DFFB3',
  '#7EC8E3',
  '#A78BFA',
  '#F4C6C6',
  '#E8E4DC',
  '#FF6B4A',
  '#F2F2F2',
]

export const INSPIRATION_QUOTES = [
  'Make the next hour count.',
  'Quiet progress is still progress.',
  'One honest list. One clear day.',
  'Do the small thing with care.',
  'Stay close to what matters.',
]

export const DEFAULT_SETTINGS = {
  title: "TODAY'S FOCUS",
  subtitle: 'A composed day, written in advance.',
  quote: 'Turn your plans into your perspective.',
  showDate: true,
  showCounter: true,
  showProgress: true,
  completedStyle: 'checked',
  themeId: 'soft-gradient',
  accentColor: '',
  backgroundColor: '',
  useCustomBackground: false,
  backgroundImage: '',
  imageOverlay: 0.38,
  imagePositionX: 0.5,
  imagePositionY: 0.5,
  fontFamily: '',
  fontScale: 1,
  taskSpacing: 1,
  dividerStyle: '',
  decorationIntensity: 0.7,
  layout: '',
  listDate: new Date().toISOString().slice(0, 10),
  dimensionId: 'standard',
  customWidth: 1080,
  customHeight: 2400,
}

export const DESIGN_PRESETS = [
  {
    id: 'night-ops',
    name: 'Night Ops',
    themeId: 'midnight-terminal',
    layout: 'compact',
    fontFamily: 'system-ui',
    decorationIntensity: 0.55,
  },
  {
    id: 'atelier',
    name: 'Atelier Paper',
    themeId: 'minimal-paper',
    layout: 'editorial',
    fontFamily: 'Georgia',
    decorationIntensity: 0.35,
  },
  {
    id: 'orbit',
    name: 'Morning Study',
    themeId: 'soft-gradient',
    layout: 'spacious',
    fontFamily: 'Segoe UI',
    decorationIntensity: 0.65,
  },
]
