import { act } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import { createRoot } from 'react-dom/client'
import { Router } from 'react-router-dom'

import { App } from '../App'

let container: HTMLDivElement | null = null
beforeEach(() => {
  container = document.createElement('div')
  document.body.append(container)
})

afterEach(() => {
  document.body.removeChild(container!)
  container = null
})

describe('test App', () => {
  it('render success', () => {
    act(() => {
      const history = createMemoryHistory()
      createRoot(container!).render(
        <Router location={history.location} navigator={history}>
          <App />
        </Router>
      )
    })

    const title = container?.querySelector('h1')!
    expect(title.textContent).toBe('Todo List')
  })
})
