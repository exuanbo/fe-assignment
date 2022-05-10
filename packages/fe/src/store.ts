import { ItemDB, TodoItem } from '@nlpdev/database'
import create from 'zustand'

export type Appearance = 'system' | 'light' | 'dark'

interface RootState {
  _id: number
  initialize: () => Promise<void>
  todoItems: TodoItem[]
  getTodoItem: (id: string) => TodoItem | undefined
  createTodoItem: (item: Omit<TodoItem, 'id'>) => Promise<void>
  updateTodoItem: (item: TodoItem) => Promise<void>
  deleteTodoItem: (id: string) => Promise<void>
  appearance: Appearance
  setAppearance: (appearance: Appearance) => void
}

export const useStore = create<RootState>((set, get) => ({
  _id: 0,
  initialize: async () => {
    const todoItems = await ItemDB.query()
    if (todoItems.length > 0) {
      const maxId = Number(todoItems[todoItems.length - 1].id)
      set({ _id: maxId + 1, todoItems })
    }
  },
  todoItems: [],
  getTodoItem: (id) => {
    const { todoItems } = get()
    return todoItems.find(item => item.id === id)
  },
  createTodoItem: async (item) => {
    const { _id } = get()
    const newItem = { ...item, id: _id.toString() }
    set(state => ({
      _id: state._id + 1,
      todoItems: [...state.todoItems, newItem]
    }))
    await ItemDB.create(newItem)
  },
  updateTodoItem: async (item) => {
    set(state => ({
      todoItems: state.todoItems.map(i => i.id === item.id ? item : i)
    }))
    await ItemDB.update(item)
  },
  deleteTodoItem: async (id) => {
    set(state => ({
      todoItems: state.todoItems.filter(i => i.id !== id)
    }))
    await ItemDB.delete(id)
  },
  appearance: 'system',
  setAppearance: (appearance) => {
    set({ appearance })
  }
}))
