import { describe, expect, it } from 'vitest'
import {
  addTaskToList,
  clearCompleted,
  createTask,
  deleteTask,
  getTaskProgress,
  getVisibleWallpaperTasks,
  moveTask,
  sanitizeTaskText,
  toggleTask,
  updateTaskText,
} from '../utils/taskUtils.js'

describe('taskUtils', () => {
  it('rejects empty and whitespace-only tasks', () => {
    expect(createTask('   ').ok).toBe(false)
    expect(sanitizeTaskText('  hello   world  ')).toBe('hello world')
  })

  it('adds, edits, toggles, deletes, and reorders tasks', () => {
    const first = addTaskToList([], 'Write copy')
    const second = addTaskToList(first.tasks, 'Export PNG')
    const edited = updateTaskText(second.tasks, first.tasks[0].id, 'Write headline')
    const toggled = toggleTask(edited.tasks, edited.tasks[0].id)
    const moved = moveTask(toggled, toggled[1].id, 'up')
    expect(moved[0].text).toBe('Export PNG')
    const removed = deleteTask(moved, moved[0].id)
    expect(removed).toHaveLength(1)
    expect(removed[0].text).toBe('Write headline')
  })

  it('calculates progress and visible wallpaper tasks', () => {
    const tasks = [
      { id: '1', text: 'A', completed: true },
      { id: '2', text: 'B', completed: false },
    ]
    expect(getTaskProgress(tasks)).toEqual({ total: 2, completed: 1, remaining: 1, percent: 50 })
    expect(getVisibleWallpaperTasks(tasks, 'hidden')).toHaveLength(1)
    expect(clearCompleted(tasks)).toHaveLength(1)
  })

  it('flags duplicate names without blocking the add', () => {
    const first = addTaskToList([], 'Same')
    const second = addTaskToList(first.tasks, 'same')
    expect(second.ok).toBe(true)
    expect(second.duplicate).toBe(true)
  })
})
