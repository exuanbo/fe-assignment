import {
  Button,
  Checkbox,
  colors,
  FormControl,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
  useTheme
} from '@mui/material'
import { TodoItem } from '@nlpdev/database'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useStore } from './store'

type Visibility = 'all' | 'active' | 'completed'

type TodoItemFilter = (item: TodoItem) => boolean

const getTodoItemFilter = (visibility: Visibility): TodoItemFilter => {
  switch (visibility) {
    case 'active':
      return (item) => !item.completed
    case 'completed':
      return (item) => item.completed
    default:
      return () => true
  }
}

export const Tasks: React.FC = () => {
  const {
    palette: { mode }
  } = useTheme()
  const [visibility, setVisibility] = useState<Visibility>('all')
  const todoItemFilter = getTodoItemFilter(visibility)
  const navigate = useNavigate()
  const todoItems = useStore((state) => state.todoItems)
  const updateTodoItem = useStore((state) => state.updateTodoItem)
  return (
    <Stack spacing={1.5} sx={{ height: '100%', width: '100%', py: 0.75, px: 2 }}>
      <Stack direction='row' justifyContent='space-between'>
        <FormControl size='small'>
          <Select
            value={visibility}
            sx={{ minWidth: '8rem' }}
            onChange={(event) => setVisibility(event.target.value as Visibility)}>
            <MenuItem value='all'>All</MenuItem>
            <MenuItem value='active'>Active</MenuItem>
            <MenuItem value='completed'>Completed</MenuItem>
          </Select>
        </FormControl>
        <Button variant='contained' onClick={() => navigate('/new')}>
          Add a Task
        </Button>
      </Stack>
      <Stack spacing={2.25} sx={{ height: '28rem', p: 0.25, overflowY: 'auto' }}>
        {todoItems
          .filter(todoItemFilter)
          .sort((a, b) => Number(b.id) - Number(a.id))
          .map((todoItem) => {
            const { id, name, completed } = todoItem
            const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
              event.preventDefault()
              updateTodoItem({ ...todoItem, completed: !completed })
            }
            return (
              <Link key={id} to={`/${id}`} style={{ textDecoration: 'none' }}>
                <Paper elevation={1} sx={{ p: 0.5, backgroundColor: colors.grey[mode === 'light' ? 50 : 900] }}>
                  <Stack direction='row' alignItems='center' justifyContent='space-between' sx={{ px: 1, py: 0.5 }}>
                    <Typography
                      {...(completed ? { style: { textDecoration: ' line-through', color: 'grey' } } : undefined)}>
                      {name}
                    </Typography>
                    <Checkbox size='medium' checked={completed} onClick={handleClick} />
                  </Stack>
                </Paper>
              </Link>
            )
          })}
      </Stack>
    </Stack>
  )
}
