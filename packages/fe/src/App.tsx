import {
  Box,
  colors,
  Container,
  createTheme,
  CssBaseline,
  GlobalStyles,
  Icon,
  Paper,
  Stack,
  Tab,
  Tabs,
  ThemeProvider,
  Typography,
  useMediaQuery
} from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { Link, matchPath, Outlet, useLocation } from 'react-router-dom'

import { useStore } from './store'

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
        <Paper sx={{ height: '32rem', width: '100%' }}>
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
