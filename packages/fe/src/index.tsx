import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { App } from './App'
import { Settings } from './Settings'
import { TaskDetail } from './TaskDetail'
import { Tasks } from './Tasks'

const app = document.getElementById('app')
const root = createRoot(app!)
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />}>
          <Route path='/' element={<Tasks />} />
          <Route path='/:id' element={<TaskDetail />} />
          <Route path='/new' element={<TaskDetail />} />
          <Route path='/settings' element={<Settings />} />
          <Route path='*' element={<Navigate to='/' />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
