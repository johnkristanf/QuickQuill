import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/index.css'
import { BrowserRouter, Route, Routes } from 'react-router'

import ParaphrasingPage from './pages/Paraphrasing'

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient()


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    
      <Routes>
          <Route 
            index 
            path='/paraphrasing-tool' 
            element={
              <QueryClientProvider client={queryClient}>
                <ParaphrasingPage />
              </QueryClientProvider>
            }
          />
        
      </Routes>

    </BrowserRouter>
  </StrictMode>,
)
