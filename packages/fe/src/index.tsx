import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { App, Settings, TaskDetail, Tasks } from './App'

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
