import { useCallback, useMemo } from 'react'
import { STORAGE_KEYS } from '../constants.js'
import { useLocalStorage } from './useLocalStorage.js'
import {
  addTaskToList,
  clearCompleted,
  deleteTask,
  getTaskProgress,
  isValidTaskList,
  moveTask,
  toggleTask,
  updateTaskText,
} from '../utils/taskUtils.js'

function asList(value) {
  return isValidTaskList(value) ? value : []
}

export function useTasks() {
  const [tasks, setTasks, persistenceEnabled] = useLocalStorage(STORAGE_KEYS.tasks, [])
  const safeTasks = useMemo(() => asList(tasks), [tasks])

  const addTask = useCallback((text) => {
    let result = { ok: false, error: 'Could not add the task.' }
    setTasks((current) => {
      result = addTaskToList(asList(current), text)
      return result.ok ? result.tasks : asList(current)
    })
    return result
  }, [setTasks])

  const editTask = useCallback((id, text) => {
    let result = { ok: false, error: 'Could not edit the task.' }
    setTasks((current) => {
      result = updateTaskText(asList(current), id, text)
      return result.ok ? result.tasks : asList(current)
    })
    return result
  }, [setTasks])

  const completeTask = useCallback((id) => {
    setTasks((current) => toggleTask(asList(current), id))
  }, [setTasks])

  const removeTask = useCallback((id) => {
    setTasks((current) => deleteTask(asList(current), id))
  }, [setTasks])

  const reorderTask = useCallback((id, direction) => {
    setTasks((current) => moveTask(asList(current), id, direction))
  }, [setTasks])

  const removeCompleted = useCallback(() => {
    setTasks((current) => clearCompleted(asList(current)))
  }, [setTasks])

  const resetTasks = useCallback(() => setTasks([]), [setTasks])

  const progress = useMemo(() => getTaskProgress(safeTasks), [safeTasks])

  return {
    tasks: safeTasks,
    addTask,
    editTask,
    completeTask,
    removeTask,
    reorderTask,
    removeCompleted,
    resetTasks,
    progress,
    persistenceEnabled,
  }
}
