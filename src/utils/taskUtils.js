import { MAX_TASK_LENGTH, MAX_TASKS } from '../constants.js'

export function createTaskId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `task-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function sanitizeTaskText(value) {
  if (typeof value !== 'string') return ''
  return value.replace(/\s+/g, ' ').trim().slice(0, MAX_TASK_LENGTH)
}

export function createTask(text) {
  const sanitized = sanitizeTaskText(text)
  if (!sanitized) {
    return { ok: false, error: 'Enter a task before adding it.' }
  }
  return {
    ok: true,
    task: {
      id: createTaskId(),
      text: sanitized,
      completed: false,
    },
  }
}

export function addTaskToList(tasks, text) {
  if (tasks.length >= MAX_TASKS) {
    return { ok: false, error: `This layout holds up to ${MAX_TASKS} tasks.` }
  }
  const result = createTask(text)
  if (!result.ok) return result
  return { ok: true, tasks: [...tasks, result.task], duplicate: tasks.some((task) => task.text.toLowerCase() === result.task.text.toLowerCase()) }
}

export function updateTaskText(tasks, id, text) {
  const sanitized = sanitizeTaskText(text)
  if (!sanitized) {
    return { ok: false, error: 'Task text cannot be empty.' }
  }
  return {
    ok: true,
    tasks: tasks.map((task) => (task.id === id ? { ...task, text: sanitized } : task)),
  }
}

export function toggleTask(tasks, id) {
  return tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
}

export function deleteTask(tasks, id) {
  return tasks.filter((task) => task.id !== id)
}

export function moveTask(tasks, id, direction) {
  const index = tasks.findIndex((task) => task.id === id)
  if (index < 0) return tasks
  const nextIndex = direction === 'up' ? index - 1 : index + 1
  if (nextIndex < 0 || nextIndex >= tasks.length) return tasks
  const next = [...tasks]
  const [item] = next.splice(index, 1)
  next.splice(nextIndex, 0, item)
  return next
}

export function clearCompleted(tasks) {
  return tasks.filter((task) => !task.completed)
}

export function getTaskProgress(tasks) {
  const total = tasks.length
  const completed = tasks.filter((task) => task.completed).length
  const remaining = total - completed
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100)
  return { total, completed, remaining, percent }
}

export function getVisibleWallpaperTasks(tasks, completedStyle) {
  if (completedStyle === 'hidden') {
    return tasks.filter((task) => !task.completed)
  }
  return tasks
}

export function isValidTaskList(value) {
  return Array.isArray(value) && value.every((task) => task && typeof task.id === 'string' && typeof task.text === 'string' && typeof task.completed === 'boolean')
}
