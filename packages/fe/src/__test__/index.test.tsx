import type { TodoItem } from '@nlpdev/database'
import { act, fireEvent, renderHook } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import { createRoot } from 'react-dom/client'
import { MemoryRouter, Route, Router, Routes } from 'react-router-dom'

import { App } from '../App'
import { Settings } from '../Settings'
import { useStore } from '../store'
import { TaskDetail } from '../TaskDetail'
import { Tasks } from '../Tasks'

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
  const history = createMemoryHistory()

  test('render', async () => {
    await act(async () => {
      createRoot(container!).render(
        <Router location={history.location} navigator={history}>
          <App />
        </Router>
      )
    })
    const title = container!.querySelector('h1')!
    expect(title.textContent).toBe('Todo')
  })

  test('tab', async () => {
    history.push('/new')
    const root = createRoot(container!)
    const renderApp = async () => {
      await act(async () => {
        root.render(
          <Router location={history.location} navigator={history}>
            <App />
          </Router>
        )
      })
    }
    await renderApp()
    const tabSelector = '.MuiTab-root.Mui-selected'
    let tab = container!.querySelector(tabSelector)!
    expect(tab.textContent).toBe('Tasks')
    history.push('/settings')
    await renderApp()
    tab = container!.querySelector(tabSelector)!
    expect(tab.textContent).toBe('Settings')
  })
})

describe('test Tasks', () => {
  const history = createMemoryHistory()

  test('render', () => {
    act(() => {
      createRoot(container!).render(
        <Router location={history.location} navigator={history}>
          <Tasks />
        </Router>
      )
    })
    const selected = container!.querySelector('.MuiSelect-select')!
    expect(selected.textContent).toBe('All')
  })

  const taskNameSelector = '.MuiTypography-body1'

  test('display tasks', () => {
    act(() => {
      createRoot(container!).render(
        <Router location={history.location} navigator={history}>
          <Tasks />
        </Router>
      )
    })
    const taskName = container!.querySelector(taskNameSelector)!
    expect(taskName.textContent).toBe('foo')
  })

  test('checkbox', () => {
    const root = createRoot(container!)
    act(() => {
      root.render(
        <Router location={history.location} navigator={history}>
          <Tasks />
        </Router>
      )
    })
    const checkbox = container!.querySelector('.MuiCheckbox-root')!
    fireEvent.click(checkbox)
    const taskName = container!.querySelector(taskNameSelector) as HTMLParagraphElement
    expect(taskName.style.textDecoration).toBe('line-through')
  })

  test('add task', () => {
    const history = createMemoryHistory()
    act(() => {
      createRoot(container!).render(
        <Router location={history.location} navigator={history}>
          <Tasks />
        </Router>
      )
    })
    const addTaskButton = container!.querySelector('.MuiButton-containedPrimary')!
    fireEvent.click(addTaskButton)
    expect(history.location.pathname).toBe('/new')
    renderHook(() => {
      const createTodoItem = useStore((state) => state.createTodoItem)
      createTodoItem({ name: 'baz', description: '', completed: false })
    })
    const taskNames = container!.querySelectorAll(taskNameSelector)!
    expect(taskNames.length).toBe(2)
  })

  test('visibility', async () => {
    act(() => {
      createRoot(container!).render(
        <Router location={history.location} navigator={history}>
          <Tasks />
        </Router>
      )
    })
    const visibilitySelect = container!.querySelector('.MuiInputBase-root .MuiSelect-nativeInput')!
    fireEvent.change(visibilitySelect, { target: { value: 'active' } })
    let taskNames = container!.querySelectorAll(taskNameSelector)!
    expect(taskNames.length).toBe(1)
    expect(taskNames[0].textContent).toBe('baz')
    fireEvent.change(visibilitySelect, { target: { value: 'completed' } })
    taskNames = container!.querySelectorAll(taskNameSelector)!
    expect(taskNames.length).toBe(1)
    expect(taskNames[0].textContent).toBe('foo')
  })
})

describe('test TaskDetail', () => {
  const nameInputSelector = 'input.MuiInputBase-input'
  const errorSelector = '.MuiFormHelperText-root.Mui-error'
  const descriptionInputSelector = 'textarea.MuiInputBase-input'
  const cancelButtonSelector = '.MuiButton-outlinedPrimary'
  const saveButtonSelector = '.MuiButton-containedPrimary'

  test('render', () => {
    act(() => {
      createRoot(container!).render(
        <MemoryRouter initialEntries={['/0']}>
          <Routes>
            <Route path='/:id' element={<TaskDetail />} />
          </Routes>
        </MemoryRouter>
      )
    })
    const nameInput = container!.querySelector(nameInputSelector)! as HTMLInputElement
    expect(nameInput.value).toBe('foo')
    const descriptionInput = container!.querySelector(descriptionInputSelector)! as HTMLTextAreaElement
    expect(descriptionInput.value).toBe('bar')
  })

  test('unknown id route', () => {
    const history = createMemoryHistory()
    history.push('/233')
    act(() => {
      createRoot(container!).render(
        <Router location={history.location} navigator={history}>
          <Routes>
            <Route path='/:id' element={<TaskDetail />} />
          </Routes>
        </Router>
      )
    })
    expect(history.location.pathname).toBe('/')
  })

  test('create', () => {
    const history = createMemoryHistory()
    history.push('/new')
    const root = createRoot(container!)
    const renderTaskDetail = () => {
      act(() => {
        root.render(
          <Router location={history.location} navigator={history}>
            <Routes>
              <Route path='/:id' element={<TaskDetail />} />
              <Route path='/new' element={<TaskDetail />} />
            </Routes>
          </Router>
        )
      })
    }
    renderTaskDetail()
    const cancelButton = container!.querySelector(cancelButtonSelector)!
    fireEvent.click(cancelButton)
    expect(history.location.pathname).toBe('/')
    history.push('/new')
    renderTaskDetail()
    const saveButton = container!.querySelector(saveButtonSelector)!
    fireEvent.click(saveButton)
    let error = container!.querySelector(errorSelector)!
    expect(error.textContent).toBe('Name is required')
    let nameInput = container!.querySelector(nameInputSelector)! as HTMLInputElement
    fireEvent.change(nameInput, { target: { value: 'qux' } })
    fireEvent.change(nameInput, { target: { value: '' } })
    error = container!.querySelector(errorSelector)!
    expect(error.textContent).toBe('Name is required')
    fireEvent.change(nameInput, { target: { value: 'qux' } })
    let descriptionInput = container!.querySelector(descriptionInputSelector)! as HTMLTextAreaElement
    fireEvent.change(descriptionInput, { target: { value: 'quux' } })
    fireEvent.click(saveButton)
    expect(history.location.pathname).toBe('/')
    history.push('/2')
    renderTaskDetail()
    nameInput = container!.querySelector(nameInputSelector)!
    expect(nameInput.value).toBe('qux')
    descriptionInput = container!.querySelector(descriptionInputSelector)!
    expect(descriptionInput.value).toBe('quux')
  })

  test('update', () => {
    const history = createMemoryHistory()
    history.push('/0')
    const root = createRoot(container!)
    const renderTaskDetail = () => {
      act(() => {
        root.render(
          <Router location={history.location} navigator={history}>
            <Routes>
              <Route path='/:id' element={<TaskDetail />} />
            </Routes>
          </Router>
        )
      })
    }
    renderTaskDetail()
    const nameInput = container!.querySelector(nameInputSelector)! as HTMLInputElement
    fireEvent.change(nameInput, { target: { value: 'foooo' } })
    const descriptionInput = container!.querySelector(descriptionInputSelector)!
    fireEvent.change(descriptionInput, { target: { value: 'barrrr' } })
    const saveButton = container!.querySelector(saveButtonSelector)!
    fireEvent.click(saveButton)
    expect(history.location.pathname).toBe('/')
    history.push('/0')
    renderTaskDetail()
    expect(nameInput.value).toBe('foooo')
  })

  test('delete', () => {
    const history = createMemoryHistory()
    history.push('/0')
    const root = createRoot(container!)
    const renderTaskDetail = () => {
      act(() => {
        root.render(
          <Router location={history.location} navigator={history}>
            <Routes>
              <Route path='/:id' element={<TaskDetail />} />
            </Routes>
          </Router>
        )
      })
    }
    renderTaskDetail()
    const deleteButton = container!.querySelector('.MuiButton-outlinedError')!
    fireEvent.click(deleteButton)
    expect(history.location.pathname).toBe('/')
    history.push('/0')
    renderTaskDetail()
    expect(history.location.pathname).toBe('/')
  })
})

describe('test Settings', () => {
  const labelSelector = '.MuiFormGroup-root label'
  const radioButtonSelector = '.MuiRadio-root'
  const labelTextSelector = `${labelSelector} .MuiFormControlLabel-label`

  test('render', () => {
    act(() => {
      createRoot(container!).render(<Settings />)
    })
    const labelText = container!.querySelector(labelTextSelector)!
    expect(labelText.textContent).toBe('System')
  })

  test('change appearance', () => {
    act(() => {
      createRoot(container!).render(<Settings />)
    })
    const darkLabel = container!.querySelectorAll(labelSelector)![1]
    fireEvent.click(darkLabel)
    const radioButton = container!.querySelectorAll(radioButtonSelector)![1]
    expect(radioButton.classList.contains('Mui-checked')).toBeTruthy()
  })
})
