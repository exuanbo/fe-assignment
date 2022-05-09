import { DBSchema, openDB } from 'idb'

import { createDBAccess } from './util'

export type TodoItem = {
  id: string
  name: string
  description: string
  completed: boolean
}

export interface TodoDBSchema extends DBSchema {
  item: {
    key: TodoItem['id']
    value: TodoItem
  }
}

const dbAccess = createDBAccess<TodoDBSchema>(
  () => openDB('todo-db', 1, {
    upgrade (database) {
      database.createObjectStore('item', {
        keyPath: 'id'
      })
    }
  }))

export const ItemDB = {
  create: async (item: TodoItem) => {
    const db = await dbAccess()
    await db.add('item', item)
  },
  query: async () => {
    const db = await dbAccess()
    return await db.getAll('item')
  },
  update: async (item: TodoItem) => {
    const db = await dbAccess()
    await db.put('item', item)
  },
  delete: async (id: string) => {
    const db = await dbAccess()
    await db.delete('item', id)
  }
}
