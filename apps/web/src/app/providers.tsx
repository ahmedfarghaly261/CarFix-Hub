import React, { ReactNode } from 'react'
import { AuthProvider } from '@/context/AuthContext'
import { ToastProvider } from '@/components/ui/ToastProvider'

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
      <ToastProvider>
        {children}
      </ToastProvider>
    </AuthProvider>
  )
}

export default AppProviders
