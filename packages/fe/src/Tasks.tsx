import {
  Button,
  Checkbox,
  colors,
  FormControl,
  MenuItem,
  PaletteMode,
  Paper,
  Select,
  Stack,
  Typography,
  useTheme
} from '@mui/material'
import { TodoItem } from '@nlpdev/database'
import React, { memo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useStore } from './store'

const Task: React.FC<{ todoItem: TodoItem; mode: PaletteMode }> = memo(({ todoItem, mode }) => {
  const updateTodoItem = useStore((state) => state.updateTodoItem)
  const { id, name, completed } = todoItem
  const handleClickCheckbox = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    updateTodoItem({ ...todoItem, completed: !completed })
  }
  return (
    <Link key={id} to={`/${id}`} style={{ textDecoration: 'none' }}>
      <Paper elevation={1} sx={{ p: 0.5, backgroundColor: colors.grey[mode === 'light' ? 50 : 900] }}>
        <Stack direction='row' alignItems='center' justifyContent='space-between' sx={{ px: 1, py: 0.5 }}>
          <Typography {...(completed ? { style: { textDecoration: 'line-through', color: 'grey' } } : undefined)}>
            {name}
          </Typography>
          <Checkbox size='small' checked={completed} onClick={handleClickCheckbox} />
        </Stack>
      </Paper>
    </Link>
  )
})

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
  const [visibility, setVisibility] = useState<Visibility>('all')
  const todoItemFilter = getTodoItemFilter(visibility)
  const navigate = useNavigate()
  const todoItems = useStore((state) => state.todoItems)
  const {
    palette: { mode }
  } = useTheme()
  return (
    <Stack spacing={1.75} sx={{ height: '100%', width: '100%', py: 0.75, px: 2 }}>
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
      <Stack spacing={3.25} sx={{ height: '24rem', px: 0.25, pt: 0.25, pb: 1, overflowY: 'auto' }}>
        {todoItems
          .filter(todoItemFilter)
          .sort((a, b) => Number(b.id) - Number(a.id))
          .map((todoItem) => (
            <Task key={todoItem.id} todoItem={todoItem} mode={mode} />
          ))}
      </Stack>
    </Stack>
  )
}
