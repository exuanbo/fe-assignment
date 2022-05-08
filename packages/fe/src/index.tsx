import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { App, Tasks } from './App'

const app = document.getElementById('app')
const root = createRoot(app!)
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />}>
          <Route path='/' element={<Tasks />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
