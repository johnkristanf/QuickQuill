import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/index.css'
import { BrowserRouter, Route, Routes } from 'react-router'

import DashboardPage from './pages/Dashboard'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
