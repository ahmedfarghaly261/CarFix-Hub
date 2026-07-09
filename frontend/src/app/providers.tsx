import React, { ReactNode } from 'react'
import { AuthProvider } from '@/context/AuthContext'

interface AppProvidersProps {
  children: ReactNode
}

/**
 * Wraps the app with all global providers.
 * Add QueryClientProvider, ThemeProvider, etc. here as needed.
 */
export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}

export default AppProviders
