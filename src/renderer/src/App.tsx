import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import AppShell from './components/AppShell'

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <AppShell />
  </StrictMode>
)
