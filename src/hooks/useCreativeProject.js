import { useCallback, useState } from 'react'
import {
  createCreativeProject,
  createTextLayer,
  fitCreativeDimensions,
  getCreativeFormat,
  MAX_TEXT_LAYERS,
  normalizeCreativeText,
} from '../creative/creativeRegistry.js'

function createLayerId() {
  return typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `layer-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function useCreativeProject(tool) {
  const [projects, setProjects] = useState(() => ({
    wallpaper: createCreativeProject('wallpaper'),
    social: createCreativeProject('social'),
  }))
  const [selectedLayerIds, setSelectedLayerIds] = useState({})
  const project = projects[tool]
  const selectedLayerId = selectedLayerIds[tool] || null

  const setSelectedLayerId = useCallback((id) => {
    setSelectedLayerIds((current) => ({ ...current, [tool]: id }))
  }, [tool])

  const updateBackground = useCallback((patch) => {
    setProjects((current) => ({
      ...current,
      [tool]: { ...current[tool], background: { ...current[tool].background, ...patch } },
    }))
  }, [tool])

  const setFormat = useCallback((formatId) => {
    setProjects((current) => {
      const projectForTool = current[tool]
      if (formatId === 'custom') {
        return {
          ...current,
          [tool]: { ...projectForTool, formatId, ...fitCreativeDimensions(projectForTool.width, projectForTool.height) },
        }
      }
      const format = getCreativeFormat(tool, formatId)
      return format
        ? { ...current, [tool]: { ...projectForTool, formatId: format.id, width: format.width, height: format.height } }
        : current
    })
  }, [tool])

  const addLayer = useCallback(() => {
    const id = createLayerId()
    setProjects((current) => {
      const projectForTool = current[tool]
      if (projectForTool.layers.length >= MAX_TEXT_LAYERS) return current
      return {
        ...current,
        [tool]: { ...projectForTool, layers: [...projectForTool.layers, createTextLayer(id)] },
      }
    })
    setSelectedLayerId(id)
  }, [setSelectedLayerId, tool])

  const updateLayer = useCallback((id, patch) => {
    setProjects((current) => ({
      ...current,
      [tool]: {
        ...current[tool],
        layers: current[tool].layers.map((layer) => (
          layer.id === id
            ? { ...layer, ...patch, ...(Object.hasOwn(patch, 'text') ? { text: normalizeCreativeText(patch.text) } : {}) }
            : layer
        )),
      },
    }))
  }, [tool])

  const duplicateLayer = useCallback((id) => {
    const newId = createLayerId()
    setProjects((current) => {
      const projectForTool = current[tool]
      const index = projectForTool.layers.findIndex((layer) => layer.id === id)
      if (index < 0 || projectForTool.layers.length >= MAX_TEXT_LAYERS) return current
      const clone = {
        ...projectForTool.layers[index],
        id: newId,
        x: Math.min(0.95, Math.round((projectForTool.layers[index].x + 0.04) * 10000) / 10000),
        y: Math.min(0.95, Math.round((projectForTool.layers[index].y + 0.04) * 10000) / 10000),
      }
      const layers = [...projectForTool.layers]
      layers.splice(index + 1, 0, clone)
      return { ...current, [tool]: { ...projectForTool, layers } }
    })
    setSelectedLayerId(newId)
  }, [setSelectedLayerId, tool])

  const deleteLayer = useCallback((id) => {
    setProjects((current) => ({
      ...current,
      [tool]: { ...current[tool], layers: current[tool].layers.filter((layer) => layer.id !== id) },
    }))
    if (selectedLayerId === id) setSelectedLayerId(null)
  }, [selectedLayerId, setSelectedLayerId, tool])

  const moveLayer = useCallback((id, direction) => {
    setProjects((current) => {
      const projectForTool = current[tool]
      const index = projectForTool.layers.findIndex((layer) => layer.id === id)
      const nextIndex = index + direction
      if (index < 0 || nextIndex < 0 || nextIndex >= projectForTool.layers.length) return current
      const layers = [...projectForTool.layers]
      const [layer] = layers.splice(index, 1)
      layers.splice(nextIndex, 0, layer)
      return { ...current, [tool]: { ...projectForTool, layers } }
    })
  }, [tool])

  const setCustomDimensions = useCallback((width, height) => {
    setProjects((current) => ({
      ...current,
      [tool]: {
        ...current[tool],
        formatId: 'custom',
        ...fitCreativeDimensions(width, height),
      },
    }))
  }, [tool])

  return {
    project,
    selectedLayerId,
    setSelectedLayerId,
    updateBackground,
    setFormat,
    addLayer,
    updateLayer,
    duplicateLayer,
    deleteLayer,
    moveLayer,
    setCustomDimensions,
  }
}
