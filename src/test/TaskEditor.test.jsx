import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import TaskEditor from '../components/TaskEditor.jsx'
import CustomizationPanel from '../components/CustomizationPanel.jsx'
import ThemeGallery from '../components/ThemeGallery.jsx'
import { DEFAULT_SETTINGS } from '../constants.js'

const progress = { total: 1, completed: 0, remaining: 1, percent: 0 }

describe('TaskEditor', () => {
  it('adds a task with the accessible add button', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn(() => ({ ok: true }))
    render(
      <TaskEditor
        tasks={[]}
        progress={{ total: 0, completed: 0, remaining: 0, percent: 0 }}
        listDate="2026-10-17"
        onDateChange={vi.fn()}
        onAdd={onAdd}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        onMove={vi.fn()}
        onEdit={vi.fn()}
        onClearCompleted={vi.fn()}
      />,
    )

    await user.type(screen.getByLabelText('Add a task'), 'Draft the headline')
    await user.click(screen.getByRole('button', { name: 'Add' }))
    expect(onAdd).toHaveBeenCalledWith('Draft the headline')
  })

  it('toggles completion from the task row', async () => {
    const user = userEvent.setup()
    const onToggle = vi.fn()
    render(
      <TaskEditor
        tasks={[{ id: '1', text: 'Lock the type', completed: false }]}
        progress={progress}
        listDate="2026-10-17"
        onDateChange={vi.fn()}
        onAdd={vi.fn()}
        onToggle={onToggle}
        onDelete={vi.fn()}
        onMove={vi.fn()}
        onEdit={vi.fn()}
        onClearCompleted={vi.fn()}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Mark Lock the type as complete' }))
    expect(onToggle).toHaveBeenCalledWith('1')
  })
})

describe('ThemeGallery and customization', () => {
  it('selects a theme and updates the title field', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    const onChange = vi.fn()
    render(
      <>
        <ThemeGallery selectedId="midnight-terminal" onSelect={onSelect} />
        <CustomizationPanel
          settings={DEFAULT_SETTINGS}
          onChange={onChange}
          onReset={vi.fn()}
          onSurprise={vi.fn()}
          onCycleTheme={vi.fn()}
          onApplyPreset={vi.fn()}
        />
      </>,
    )

    await user.click(screen.getByRole('button', { name: /Cosmic Focus/i }))
    expect(onSelect).toHaveBeenCalledWith('cosmic-focus')
    await user.clear(screen.getByLabelText('Title'))
    await user.type(screen.getByLabelText('Title'), 'X')
    expect(onChange).toHaveBeenCalled()
  })
})
