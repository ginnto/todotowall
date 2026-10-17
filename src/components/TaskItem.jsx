import { useState } from 'react'
import { Check, ChevronDown, ChevronUp, Pencil, Trash2, X } from 'lucide-react'

export default function TaskItem({ task, index, total, onToggle, onDelete, onMove, onEdit }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(task.text)

  const save = () => {
    const result = onEdit(task.id, draft)
    if (result?.ok !== false) setEditing(false)
  }

  return (
    <li className={`task-item ${task.completed ? 'is-complete' : ''}`}>
      <button
        type="button"
        className="task-check"
        onClick={() => onToggle(task.id)}
        aria-pressed={task.completed}
        aria-label={task.completed ? `Mark ${task.text} as incomplete` : `Mark ${task.text} as complete`}
      >
        {task.completed ? <Check size={14} /> : null}
      </button>
      {editing ? (
        <input
          className="task-edit"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={save}
          onKeyDown={(event) => {
            if (event.key === 'Enter') save()
            if (event.key === 'Escape') {
              setDraft(task.text)
              setEditing(false)
            }
          }}
          aria-label="Edit task"
          autoFocus
        />
      ) : (
        <p className="task-text">{task.text}</p>
      )}
      <div className="task-actions">
        <button type="button" className="icon-button" onClick={() => onMove(task.id, 'up')} disabled={index === 0} aria-label="Move task up">
          <ChevronUp size={16} />
        </button>
        <button type="button" className="icon-button" onClick={() => onMove(task.id, 'down')} disabled={index === total - 1} aria-label="Move task down">
          <ChevronDown size={16} />
        </button>
        {editing ? (
          <button type="button" className="icon-button" onClick={() => { setDraft(task.text); setEditing(false) }} aria-label="Cancel editing">
            <X size={16} />
          </button>
        ) : (
          <button type="button" className="icon-button" onClick={() => { setDraft(task.text); setEditing(true) }} aria-label={`Edit ${task.text}`}>
            <Pencil size={16} />
          </button>
        )}
        <button type="button" className="icon-button danger" onClick={() => onDelete(task.id)} aria-label={`Delete ${task.text}`}>
          <Trash2 size={16} />
        </button>
      </div>
    </li>
  )
}
