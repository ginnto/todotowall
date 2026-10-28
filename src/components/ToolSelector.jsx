const TOOLS = [
  { id: 'tasks', number: '01', title: 'Task wallpaper', detail: 'Compose a daily checklist into a wallpaper.' },
  { id: 'wallpaper', number: '02', title: 'Custom wallpaper', detail: 'Create a personal design with text and images.' },
  { id: 'social', number: '03', title: 'Instagram posts & stories', detail: 'Design square posts, portraits, and stories.' },
]

export default function ToolSelector({ activeTool, onSelect, compact = false }) {
  return (
    <nav className={`tool-selector ${compact ? 'is-compact' : ''}`} aria-label="Choose a creative tool">
      {TOOLS.map((tool) => (
        <button
          key={tool.id}
          type="button"
          className={`tool-choice ${activeTool === tool.id ? 'is-active' : ''}`}
          onClick={() => onSelect(tool.id)}
          aria-pressed={activeTool === tool.id}
        >
          <span className="tool-number">{tool.number}</span>
          <span className="tool-choice-copy">
            <strong>{tool.title}</strong>
            {!compact ? <small>{tool.detail}</small> : null}
          </span>
          <span className="tool-arrow" aria-hidden="true">↗</span>
        </button>
      ))}
    </nav>
  )
}
