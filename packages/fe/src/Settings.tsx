import { Box, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Stack } from '@mui/material'
import React from 'react'

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
