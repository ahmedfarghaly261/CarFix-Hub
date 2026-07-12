import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AppProviders } from './providers'
import RootRouter from './router'

/**
 * Application root.
 * Composes providers, browser router, and the role-based router.
 */
const App: React.FC = () => {
  return (
    <AppProviders>
      <BrowserRouter>
        <RootRouter />
      </BrowserRouter>
    </AppProviders>
  )
}

export default App
