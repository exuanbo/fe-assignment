import {
  Box,
  Button,
  colors,
  Container,
  CssBaseline,
  FormControl,
  GlobalStyles,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tab,
  Tabs,
  Typography
} from '@mui/material'
// import { ItemDB } from '@nlpdev/database'
import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'

import { useStore, ViewOption } from './store'

export const Tasks: React.FC = () => {
  const viewOption = useStore((state) => state.viewOption)
  const setViewOption = useStore((state) => state.setViewOption)
  return (
    <Box sx={{ width: '100%' }}>
      <Stack direction='row' justifyContent='space-between' sx={{ px: 2, py: 0.75 }}>
        <FormControl size='small'>
          <Select
            value={viewOption}
            sx={{ minWidth: 160 }}
            onChange={(event) => setViewOption(event.target.value as ViewOption)}>
            <MenuItem value={ViewOption.All}>All</MenuItem>
            <MenuItem value={ViewOption.NotCompleted}>Not Completed</MenuItem>
            <MenuItem value={ViewOption.Completed}>Completed</MenuItem>
          </Select>
        </FormControl>
        <Button variant='contained'>Add a Task</Button>
      </Stack>
    </Box>
  )
}

export const App: React.FC = () => {
  const { pathname } = useLocation()
  return (
    <>
      <CssBaseline />
      <GlobalStyles styles={{ '#app': { backgroundColor: colors.grey[50] } }} />
      <Container maxWidth='md' sx={{ height: '100vh' }}>
        <Box sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Paper sx={{ height: '50%', width: '100%' }}>
            <Stack height='100%'>
              <Box sx={{ width: '100%', borderBottom: 1, borderColor: 'divider', px: 2, py: 1 }}>
                <Typography variant='h6' component='h1'>
                  Todo List
                </Typography>
              </Box>
              <Stack direction='row' height='100%' sx={{ flexGrow: 1 }}>
                <Box sx={{ height: '100%', borderRight: 1, borderColor: 'divider' }}>
                  <Tabs orientation='vertical' value={pathname}>
                    <Tab value='/' to='/' label='Tasks' component={Link} />
                  </Tabs>
                </Box>
                <Outlet />
              </Stack>
            </Stack>
          </Paper>
        </Box>
      </Container>
    </>
  )
}
