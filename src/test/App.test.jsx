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
  })

  it('changes theme without losing the task list', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText('Add a task'), 'Keep this task')
    await user.keyboard('{Enter}')
    await user.click(screen.getAllByRole('button', { name: /Minimal Paper/i })[0])
    expect(screen.getByText('Keep this task')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /Minimal Paper/i })[0]).toHaveAttribute('aria-pressed', 'true')
  })

  it('updates the wallpaper title from customization', async () => {
    const user = userEvent.setup()
    render(<App />)
    const title = screen.getAllByLabelText('Title')[0]
    await user.clear(title)
    await user.type(title, 'MORNING LIST')
    await waitFor(() => expect(title).toHaveValue('MORNING LIST'))
  })
})
