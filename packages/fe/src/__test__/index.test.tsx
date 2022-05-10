import type { TodoItem } from '@nlpdev/database'
import { act } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import { createRoot } from 'react-dom/client'
import { Router } from 'react-router-dom'

import { App, Settings, Tasks } from '../App'

jest.mock('@nlpdev/database', () => {
  const db = new Map<string, TodoItem>()
  db.set('0', { id: '0', name: 'foo', description: 'bar', completed: false })
  return {
    ItemDB: {
      create: async (item: TodoItem) => {
        db.set(item.id, item)
      },
      query: async () => {
        return [...db.values()]
      },
      update: async (item: TodoItem) => {
        db.set(item.id, item)
      },
      delete: async (id: string) => {
        db.delete(id)
      }
    }
  }
})

let container: HTMLDivElement | null = null
beforeEach(() => {
  container = document.createElement('div')
  document.body.append(container)
})

afterEach(() => {
  document.body.removeChild(container!)
  container = null
  jest.resetModules()
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
