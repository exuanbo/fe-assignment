import {
  Box,
  Button,
  Checkbox,
  colors,
  Container,
  createTheme,
  CssBaseline,
  FormControl,
  FormControlLabel,
  FormLabel,
  GlobalStyles,
  Icon,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  ThemeProvider,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material'
import { TodoItem } from '@nlpdev/database'
import React, { useEffect, useMemo, useState } from 'react'
import { Link, matchPath, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'

import { Appearance, useStore } from './store'

export const Settings: React.FC = () => {
  const appearance = useStore((state) => state.appearance)
  const setAppearance = useStore((state) => state.setAppearance)
  return (
    <Box sx={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Stack>
        <FormControl>
          <FormLabel>Appearance</FormLabel>
          <RadioGroup row value={appearance} onChange={(event) => setAppearance(event.target.value as Appearance)}>
            <FormControlLabel value='system' control={<Radio />} label='System' />
            <FormControlLabel value='dark' control={<Radio />} label='Dark' />
            <FormControlLabel value='light' control={<Radio />} label='Light' />
          </RadioGroup>
        </FormControl>
      </Stack>
    </Box>
  )
}

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
    // should display alert
    return null
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
        mb: 2,
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

enum ViewOption {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

type TodoItemFilter = (item: TodoItem) => boolean

const getTodoItemFilter = (viewOption: ViewOption): TodoItemFilter => {
  switch (viewOption) {
    case ViewOption.Active:
      return (item) => !item.completed
    case ViewOption.Completed:
      return (item) => item.completed
    default:
      return () => true
  }
}

export const Tasks: React.FC = () => {
  const {
    palette: { mode }
  } = useTheme()
  const [viewOption, setViewOption] = useState(ViewOption.All)
  const todoItemFilter = getTodoItemFilter(viewOption)
  const navigate = useNavigate()
  const todoItems = useStore((state) => state.todoItems)
  const updateTodoItem = useStore((state) => state.updateTodoItem)
  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Stack direction='row' justifyContent='space-between' sx={{ px: 2, py: 0.75, position: 'sticky' }}>
        <FormControl size='small'>
          <Select
            value={viewOption}
            sx={{ minWidth: '8rem' }}
            onChange={(event) => setViewOption(event.target.value as ViewOption)}>
            <MenuItem value={ViewOption.All}>All</MenuItem>
            <MenuItem value={ViewOption.Active}>Active</MenuItem>
            <MenuItem value={ViewOption.Completed}>Completed</MenuItem>
          </Select>
        </FormControl>
        <Button variant='contained' onClick={() => navigate('/new')}>
          Add a Task
        </Button>
      </Stack>
      <Stack spacing={2} sx={{ height: '480px', px: 2.25, py: 1.25, overflowY: 'auto' }}>
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
    </Box>
  )
}

const useRouteMatch = (patterns: string[]) => {
  const { pathname } = useLocation()
  for (const pattern of patterns) {
    const possibleMatch = matchPath(pattern, pathname)
    if (possibleMatch) {
      return possibleMatch
    }
  }
  return null
}

export const App: React.FC = () => {
  const [isReady, setIsReady] = useState(false)
  const initializeStore = useStore((state) => state.initialize)

  useEffect(() => {
    if (!isReady) {
      (async () => {
        await initializeStore()
        setIsReady(true)
      })()
    }
  }, [isReady, initializeStore])

  const appearance = useStore((state) => state.appearance)
  const preferDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const mode = appearance === 'system' ? (preferDarkMode ? 'dark' : 'light') : appearance
  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode])

  const routeMatch = useRouteMatch(['/settings', '/'])
  const currentTab = routeMatch?.pattern.path ?? '/'

  return isReady
    ? (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={{ '#app': { backgroundColor: colors.grey[mode === 'light' ? 50 : 900] } }} />
      <Container maxWidth='sm' sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
        <Paper sx={{ height: '600px', width: '100%' }}>
          <Stack height='100%'>
            <Stack
              direction='row'
              alignItems='center'
              spacing={0.75}
              sx={{ width: '100%', borderBottom: 1, borderColor: 'divider', px: 1.5, py: 1 }}>
              <Icon>playlist_add_check</Icon>
              <Typography variant='h6' component='h1'>
                Todo
              </Typography>
            </Stack>
            <Stack direction='row' sx={{ height: '100%' }}>
              <Box sx={{ borderRight: 1, borderColor: 'divider' }}>
                <Tabs orientation='vertical' value={currentTab}>
                  <Tab value='/' to='/' label='Tasks' component={Link} />
                  <Tab value='/settings' to='/settings' label='Settings' component={Link} />
                </Tabs>
              </Box>
              <Outlet />
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </ThemeProvider>
      )
    : null
}
