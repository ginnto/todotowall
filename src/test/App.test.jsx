import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from '../App.jsx'

describe('App integration', () => {
  it('adds a task and keeps the studio preview in the document', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(screen.getByRole('heading', { name: /everyday goals/i })).toBeInTheDocument()
    await user.type(screen.getByLabelText('Add a task'), 'Compose tonight')
    await user.keyboard('{Enter}')
    expect(await screen.findByText('Compose tonight')).toBeInTheDocument()
    expect(screen.getByLabelText('Mobile wallpaper preview')).toBeInTheDocument()
    expect(screen.getByLabelText('Choose a photo')).toBeInTheDocument()
    expect(document.querySelectorAll('#themes .theme-card')).toHaveLength(3)
  })

  it('changes theme without losing the task list', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText('Add a task'), 'Keep this task')
    await user.keyboard('{Enter}')
    await user.click(screen.getAllByRole('button', { name: /Atelier Paper/i })[0])
    expect(screen.getByText('Keep this task')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /Atelier Paper/i })[0]).toHaveAttribute('aria-pressed', 'true')
  })

  it('updates the wallpaper title from customization', async () => {
    const user = userEvent.setup()
    render(<App />)
    const title = screen.getAllByLabelText('Title')[0]
    await user.clear(title)
    await user.type(title, 'MORNING LIST')
    await waitFor(() => expect(title).toHaveValue('MORNING LIST'))
  })

  it('switches the live preview to desktop dimensions', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /Desktop landscape 1920 by 1080/i }))
    expect(screen.getByLabelText('Desktop wallpaper preview')).toBeInTheDocument()
    expect(screen.getByText(/1920×1080/)).toBeInTheDocument()
  })

  it('keeps the task wallpaper available when switching to and from creative tools', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText('Add a task'), 'Preserve this task')
    await user.keyboard('{Enter}')

    await user.click(screen.getByRole('button', { name: /Custom wallpaper/i }))
    expect(screen.getByRole('heading', { name: 'Custom wallpaper creator' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Add text/i }))
    await user.clear(screen.getByLabelText('Text'))
    await user.type(screen.getByLabelText('Text'), 'Keep this creative draft')
    await user.click(screen.getByRole('button', { name: /Instagram posts & stories/i }))
    expect(screen.getByRole('heading', { name: 'Instagram post & story creator' })).toBeInTheDocument()
    expect(screen.queryByLabelText('Text')).not.toBeInTheDocument()
    await user.click(screen.getAllByRole('button', { name: /Task wallpaper/i })[1])
    expect(screen.getByText('Preserve this task')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Custom wallpaper/i }))
    expect(screen.getByLabelText('Text')).toHaveValue('Keep this creative draft')
  }, 15000)
})
