import {
  Box,
  Button,
  colors,
  Container,
  CssBaseline,
  FormControl,
  FormControlLabel,
  FormLabel,
  GlobalStyles,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Tab,
  Tabs,
  Typography
} from '@mui/material'
// import { ItemDB } from '@nlpdev/database'
import React from 'react'
import { Link, matchPath, Outlet, useLocation } from 'react-router-dom'

import { Appearance, useStore, ViewOption } from './store'

export const Settings: React.FC = () => {
  const appearance = useStore((state) => state.appearance)
  const setAppearance = useStore((state) => state.setAppearance)
  return (
    <Box sx={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Stack>
        <FormControl>
          <FormLabel>Appearance</FormLabel>
          <RadioGroup row value={appearance} onChange={(event) => setAppearance(event.target.value as Appearance)}>
            <FormControlLabel value={Appearance.System} control={<Radio />} label='System' />
            <FormControlLabel value={Appearance.Dark} control={<Radio />} label='Dark' />
            <FormControlLabel value={Appearance.Light} control={<Radio />} label='Light' />
          </RadioGroup>
        </FormControl>
      </Stack>
    </Box>
  )
}

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
  const routeMatch = useRouteMatch(['/settings', '/'])
  const currentTab = routeMatch?.pattern.path
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
                  <Tabs orientation='vertical' value={currentTab}>
                    <Tab value='/' to='/' label='Tasks' component={Link} />
                    <Tab value='/settings' to='/settings' label='Settings' component={Link} />
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
