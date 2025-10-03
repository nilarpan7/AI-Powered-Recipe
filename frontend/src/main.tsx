import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { App } from './screens/App'
import { Generate } from './screens/Generate'
import { History } from './screens/History'
import { Welcome } from './screens/Welcome'
import './styles.css'

const root = createRoot(document.getElementById('root')!)
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}> 
          <Route index element={<Welcome />} />
          <Route path="generate" element={<Generate />} />
          <Route path="history" element={<History />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)


