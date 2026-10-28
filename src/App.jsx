import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Header from './components/Header.jsx'
import HeroSection from './components/HeroSection.jsx'
import TaskEditor from './components/TaskEditor.jsx'
import ThemeGallery from './components/ThemeGallery.jsx'
import CustomizationPanel from './components/CustomizationPanel.jsx'
import WallpaperPreview from './components/WallpaperPreview.jsx'
import ExportControls from './components/ExportControls.jsx'
import Toast from './components/Toast.jsx'
import { useLocalStorage } from './hooks/useLocalStorage.js'
import { useTasks } from './hooks/useTasks.js'
import { useWallpaperSettings } from './hooks/useWallpaperSettings.js'
import CreativeStudio from './components/CreativeStudio.jsx'
import ToolSelector from './components/ToolSelector.jsx'
import { STORAGE_KEYS } from './constants.js'
import { createOffscreenCanvas, renderWallpaper } from './utils/wallpaperRenderer.js'
import { getOutputSize } from './utils/wallpaperLayouts.js'
import { downloadCanvasPng, formatWallpaperFilename } from './utils/downloadUtils.js'
import { prepareBackgroundImage } from './utils/imageUtils.js'
import './styles/global.css'
import './styles/layout.css'
import './styles/components.css'
import './styles/responsive.css'
import './styles/creative.css'

function App() {
  const [activeTool, setActiveTool] = useState('tasks')
  const [lastCreativeTool, setLastCreativeTool] = useState('wallpaper')
  const [appearance, setAppearance] = useLocalStorage(STORAGE_KEYS.appearance, 'dark')
  const { tasks, addTask, editTask, completeTask, removeTask, reorderTask, removeCompleted, resetTasks, progress, persistenceEnabled } = useTasks()
  const {
    settings,
    history,
    updateSettings,
    applyTheme,
    resetCustomization,
    applyPreset,
    surpriseMe,
    cycleTheme,
    resetAll,
  } = useWallpaperSettings()

  const previewRef = useRef(null)
  const heroRef = useRef(null)
  const [status, setStatus] = useState('rendering')
  const [warning, setWarning] = useState('')
  const [toast, setToast] = useState(null)
  const [downloading, setDownloading] = useState(false)
  const payload = useMemo(() => ({ tasks, settings }), [tasks, settings])
  const outputSize = getOutputSize(settings)
  const aspectRatio = `${outputSize.width} / ${outputSize.height}`
  const isDesktop = settings.dimensionId === 'desktop' || outputSize.width > outputSize.height

  const showToast = useCallback((message, tone = 'success') => {
    setToast({ message, tone, id: Date.now() })
  }, [])

  useEffect(() => {
    if (!toast) return undefined
    const timer = window.setTimeout(() => setToast(null), 3200)
    return () => window.clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    document.documentElement.dataset.appearance = appearance
  }, [appearance])

  useEffect(() => {
    let cancelled = false
    const timer = window.setTimeout(async () => {
      setStatus('rendering')
      try {
        const previewRatio = Math.min(2, window.devicePixelRatio || 1)
        if (previewRef.current) {
          const result = await renderWallpaper(previewRef.current, payload, {
            size: outputSize,
            pixelRatio: previewRatio,
          })
          if (!cancelled) setWarning(result.warning || '')
        }
        if (heroRef.current) {
          await renderWallpaper(heroRef.current, payload, {
            size: outputSize,
            pixelRatio: 1,
          })
        }
        if (!cancelled) setStatus('ready')
      } catch (error) {
        if (!cancelled) {
          setStatus('error')
          setWarning(error.message || 'The wallpaper could not be rendered.')
        }
      }
    }, 90)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [payload, outputSize])

  const handleDownload = async () => {
    if (status !== 'ready') {
      showToast('Wait for the preview to finish before downloading.', 'error')
      return
    }
    setDownloading(true)
    try {
      const canvas = createOffscreenCanvas()
      const result = await renderWallpaper(canvas, payload, { size: outputSize, pixelRatio: 1 })
      const filename = formatWallpaperFilename({
        themeId: settings.themeId,
        date: settings.listDate,
        width: result.width,
        height: result.height,
      })
      await downloadCanvasPng(canvas, filename)
      showToast(`Saved ${filename}`)
    } catch (error) {
      showToast(error.message || 'Download failed.', 'error')
    } finally {
      setDownloading(false)
    }
  }

  const handleResetData = () => {
    const confirmed = window.confirm('Reset tasks, customization, and saved history in this browser?')
    if (!confirmed) return
    resetTasks()
    resetAll()
    showToast('Saved data cleared.')
  }

  const handleImageUpload = async (file) => {
    try {
      const backgroundImage = await prepareBackgroundImage(file)
      updateSettings({ backgroundImage })
      showToast('Photo background added.')
    } catch (error) {
      showToast(error.message || 'The image could not be added.', 'error')
    }
  }

  const goToStudio = () => {
    document.getElementById('studio')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="app-shell">
      <div hidden={activeTool !== 'tasks'}>
        <Header
          appearance={appearance}
          onToggleAppearance={() => setAppearance(appearance === 'dark' ? 'light' : 'dark')}
          onCreate={goToStudio}
        />
        <ToolSelector
          activeTool={activeTool}
          onSelect={(tool) => {
            setActiveTool(tool)
            if (tool !== 'tasks') setLastCreativeTool(tool)
          }}
        />
        <main>
        <HeroSection previewCanvasRef={heroRef} aspectRatio={aspectRatio} />
        <section className="studio" id="studio">
          <div className="studio-copy">
            <p className="section-kicker">Studio</p>
            <h2>Compose the frame</h2>
            <p>Edit your list and see the wallpaper update as you customize it.</p>
          </div>
          <div className="studio-grid">
            <div className="studio-controls">
              <TaskEditor
                tasks={tasks}
                progress={progress}
                listDate={settings.listDate}
                onDateChange={(listDate) => updateSettings({ listDate })}
                onAdd={addTask}
                onToggle={completeTask}
                onDelete={removeTask}
                onMove={reorderTask}
                onEdit={editTask}
                onClearCompleted={removeCompleted}
              />
              <ThemeGallery selectedId={settings.themeId} onSelect={applyTheme} />
              <CustomizationPanel
                settings={settings}
                onChange={updateSettings}
                onReset={resetCustomization}
                onSurprise={surpriseMe}
                onCycleTheme={cycleTheme}
                onApplyPreset={applyPreset}
                onImageUpload={handleImageUpload}
              />
            </div>
            <aside className="studio-preview">
              <WallpaperPreview
                canvasRef={previewRef}
                aspectRatio={aspectRatio}
                status={status}
                warning={warning}
                empty={tasks.length === 0}
                isDesktop={isDesktop}
              />
              <ExportControls
                settings={settings}
                onSelectSize={(dimensionId) => updateSettings({ dimensionId })}
                onDownload={handleDownload}
                downloading={downloading}
                onResetData={handleResetData}
                persistenceEnabled={persistenceEnabled}
              />
              {history.length ? (
                <section className="panel" aria-label="Recent designs">
                  <p className="section-kicker">Recent themes</p>
                  <div className="preset-row">
                    {history.map((item) => (
                      <button key={item.id} type="button" className="chip" onClick={() => applyTheme(item.themeId)}>
                        {item.themeId.replace(/-/g, ' ')}
                      </button>
                    ))}
                  </div>
                </section>
              ) : null}
            </aside>
          </div>
        </section>
        </main>
        <footer className="site-footer">
          <p>{BRAND_FOOTER}</p>
        </footer>
        <Toast toast={toast} />
      </div>
      <div hidden={activeTool === 'tasks'}>
        <CreativeStudio
          active={activeTool !== 'tasks'}
          tool={activeTool === 'tasks' ? lastCreativeTool : activeTool}
          onBack={() => setActiveTool('tasks')}
          onSwitchTool={(tool) => {
            setActiveTool(tool)
            if (tool !== 'tasks') setLastCreativeTool(tool)
          }}
        />
      </div>
    </div>
  )
}

const BRAND_FOOTER = 'TASKFRAME — a local design studio for daily lists. Your photos and tasks stay on this device.'

export default App
