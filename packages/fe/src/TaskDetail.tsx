import { Button, colors, Paper, Stack, TextField, useTheme } from '@mui/material'
import { TodoItem } from '@nlpdev/database'
import React, { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'

import { useStore } from './store'

export const TaskDetail: React.FC = () => {
  const { id } = useParams()
  const getTodoItem = useStore((state) => state.getTodoItem)
  let todoItem: TodoItem | undefined
  if (id) {
    todoItem = getTodoItem(id)
  }
  const { name = '', description = '', completed = false } = todoItem ?? {}
  const [nameValue, setNameValue] = useState(name)
  const [hasNameError, setHasNameError] = useState(false)
  const [descriptionValue, setDescriptionValue] = useState(description)

  const createTodoItem = useStore((state) => state.createTodoItem)
  const updateTodoItem = useStore((state) => state.updateTodoItem)
  const deleteTodoItem = useStore((state) => state.deleteTodoItem)
  const navigate = useNavigate()

  const {
    palette: { mode }
  } = useTheme()

  if (id && !todoItem) {
    return <Navigate to='/' />
  }

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const currentName = event.target.value
    setNameValue(currentName)
    setHasNameError(!currentName)
  }

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescriptionValue(event.target.value)
  }

  const handleClickSave = () => {
    if (!nameValue) {
      setHasNameError(true)
      return
    }
    const item = { name: nameValue, description: descriptionValue, completed }
    if (id) {
      updateTodoItem({ id, ...item })
    } else {
      createTodoItem(item)
    }
    navigate('/')
  }

  const handleClickDelete = (id: string) => {
    deleteTodoItem(id)
    navigate('/')
  }

  return (
    <Paper
      elevation={1}
      sx={{
        width: '100%',
        p: 2,
        mt: 0.75,
        mx: 2.25,
        mb: 3.3,
        backgroundColor: colors.grey[mode === 'light' ? 50 : 900]
      }}>
      <Stack spacing={2}>
        <Stack component='form' autoComplete='off' alignItems='center' spacing={2}>
          <TextField
            required
            fullWidth
            error={hasNameError}
            helperText={hasNameError ? 'Name is required' : undefined}
            size='small'
            variant='standard'
            label='Name'
            value={nameValue}
            onChange={handleNameChange}
          />
          <TextField
            fullWidth
            multiline
            minRows={6}
            maxRows={12}
            label='Description'
            value={descriptionValue}
            onChange={handleDescriptionChange}
          />
        </Stack>
        <Stack direction='row' spacing={2}>
          {id
            ? (
            <Button variant='outlined' color='error' onClick={() => handleClickDelete(id)}>
              Delete
            </Button>
              )
            : (
            <Button variant='outlined' onClick={() => navigate('/')}>
              Cancel
            </Button>
              )}
          <Button variant='contained' color='primary' onClick={handleClickSave}>
            Save
          </Button>
        </Stack>
      </Stack>
    </Paper>
  )
}
