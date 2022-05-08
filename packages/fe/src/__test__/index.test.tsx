import { act } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import { createRoot } from 'react-dom/client'
import { Router } from 'react-router-dom'

import { App, Tasks } from '../App'

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
  test('render', () => {
    act(() => {
      const history = createMemoryHistory()
      createRoot(container!).render(
        <Router location={history.location} navigator={history}>
          <App />
        </Router>
      )
    })

    const title = container!.querySelector('h1')!
    expect(title.textContent).toBe('Todo List')
  })
})

describe('test Tasks', () => {
  test('render', () => {
    act(() => {
      createRoot(container!).render(<Tasks />)
    })

    const selected = container!.querySelector('.MuiSelect-select')!
    expect(selected.textContent).toBe('All')
  })
})
