import { act } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import { createRoot } from 'react-dom/client'
import { Router } from 'react-router-dom'

import { App, Settings, Tasks } from '../App'

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
    expect(title.textContent).toBe('Todo')
  })
})

describe('test Tasks', () => {
  test('render', () => {
    act(() => {
      const history = createMemoryHistory()
      createRoot(container!).render(
        <Router location={history.location} navigator={history}>
          <Tasks />
        </Router>
      )
    })

    const selected = container!.querySelector('.MuiSelect-select')!
    expect(selected.textContent).toBe('All')
  })
})

describe('test Settings', () => {
  test('render', () => {
    act(() => {
      createRoot(container!).render(<Settings />)
    })

    const selectedLabel = container!.querySelector('.MuiFormGroup-root label')!
    const labelText = selectedLabel.querySelector('.MuiFormControlLabel-label')!
    expect(labelText.textContent).toBe('System')
  })
})
