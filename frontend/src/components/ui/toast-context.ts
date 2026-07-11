import { createContext } from 'react'

export type ToastType = 'success' | 'error' | 'info'

export type ToastInput = {
  title?: string
  message: string
  type?: ToastType
  duration?: number
}

export type Toast = Required<Omit<ToastInput, 'title'>> & {
  id: string
  title?: string
}

export type ToastContextValue = {
  showToast: (toast: ToastInput) => void
  success: (message: string, title?: string) => void
  error: (message: string, title?: string) => void
  info: (message: string, title?: string) => void
  dismissToast: (id: string) => void
}

export const ToastContext = createContext<ToastContextValue | undefined>(undefined)
