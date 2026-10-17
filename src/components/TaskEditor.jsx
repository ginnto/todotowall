import { useState } from 'react'
import { ListTodo, Plus } from 'lucide-react'
import { MAX_TASKS } from '../constants.js'
import TaskItem from './TaskItem.jsx'
import TaskProgress from './TaskProgress.jsx'

export default function TaskEditor({
  tasks,
  progress,
  listDate,
  onDateChange,
  onAdd,
  onToggle,
  onDelete,
  onMove,
  onEdit,
  onClearCompleted,
}) {
  const [draft, setDraft] = useState('')
  const [error, setError] = useState('')

  const submit = (event) => {
    event.preventDefault()
    const result = onAdd(draft)
    if (!result.ok) {
      setError(result.error)
      return
    }
    setDraft('')
    setError(result.duplicate ? 'Added. A similar task already exists.' : '')
  }

  const handleClear = () => {
    if (!progress.completed) return
    const confirmed = window.confirm(`Clear ${progress.completed} completed ${progress.completed === 1 ? 'task' : 'tasks'}?`)
    if (confirmed) onClearCompleted()
  }

  return (
    <section className="panel" aria-labelledby="task-editor-title">
      <div className="panel-head">
        <p className="section-kicker">Tasks</p>
        <h2 id="task-editor-title">Daily list</h2>
        <p className="panel-help">These tasks render on the wallpaper. Checking a box here updates the image, not the downloaded file.</p>
      </div>
      <label className="field">
        <span>List date</span>
        <input type="date" value={listDate} onChange={(event) => onDateChange(event.target.value)} />
      </label>
      <TaskProgress progress={progress} />
      <form className="task-form" onSubmit={submit}>
        <label className="sr-only" htmlFor="new-task">Add a task</label>
        <input
          id="new-task"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Write a task and press Enter"
          maxLength={140}
        />
        <button type="submit" className="button primary" disabled={tasks.length >= MAX_TASKS}>
          <Plus size={16} aria-hidden="true" />
          Add
        </button>
      </form>
      {error ? <p className="field-error">{error}</p> : null}
      {tasks.length === 0 ? (
        <div className="empty-state">
          <ListTodo size={28} aria-hidden="true" />
          <h3>Start with one honest task</h3>
          <p>Empty frames stay quiet on purpose. Nothing here is treated as your list until you add it.</p>
        </div>
      ) : (
        <ul className="task-list">
          {tasks.map((task, index) => (
            <TaskItem
              key={task.id}
              task={task}
              index={index}
              total={tasks.length}
              onToggle={onToggle}
              onDelete={onDelete}
              onMove={onMove}
              onEdit={onEdit}
            />
          ))}
        </ul>
      )}
      <div className="panel-footer">
        <p>{tasks.length}/{MAX_TASKS} tasks</p>
        <button type="button" className="button ghost" onClick={handleClear} disabled={!progress.completed}>
          Clear completed
        </button>
      </div>
    </section>
  )
}
