import { Box, colors, Container, CssBaseline, GlobalStyles, Paper, Stack, Tab, Tabs, Typography } from '@mui/material'
// import { ItemDB } from '@nlpdev/database'
import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
// import create from 'zustand'

// const useStore = create(() => ({}))

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
