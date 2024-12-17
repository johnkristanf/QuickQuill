import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/index.css'
import { BrowserRouter, Route, Routes } from 'react-router'

import ParaphrasingPage from './pages/Paraphrasing'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<ParaphrasingPage />}/>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
