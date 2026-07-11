import React, { ReactNode, useCallback, useMemo, useState } from 'react'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'
import { Toast, ToastContext, ToastInput, ToastType } from './toast-context'

const toastStyles: Record<ToastType, string> = {
  success: 'border-emerald-200 bg-white text-gray-900 shadow-emerald-950/10',
  error: 'border-red-200 bg-white text-gray-900 shadow-red-950/10',
  info: 'border-blue-200 bg-white text-gray-900 shadow-blue-950/10',
}

const iconStyles: Record<ToastType, string> = {
  success: 'bg-emerald-50 text-emerald-600',
  error: 'bg-red-50 text-red-600',
  info: 'bg-blue-50 text-blue-600',
}

const ToastIcon = ({ type }: { type: ToastType }) => {
  const className = 'h-5 w-5'

  if (type === 'success') return <CheckCircle2 className={className} />
  if (type === 'error') return <AlertCircle className={className} />
  return <Info className={className} />
}

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback(
    ({ title, message, type = 'info', duration = 4000 }: ToastInput) => {
      const id =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`

      setToasts((current) => [
        ...current,
        {
          id,
          title,
          message,
          type,
          duration,
        },
      ])

      if (duration > 0) {
        window.setTimeout(() => dismissToast(id), duration)
      }
    },
    [dismissToast],
  )

  const value = useMemo(
    () => ({
      showToast,
      dismissToast,
      success: (message: string, title?: string) => showToast({ message, title, type: 'success' }),
      error: (message: string, title?: string) => showToast({ message, title, type: 'error' }),
      info: (message: string, title?: string) => showToast({ message, title, type: 'info' }),
    }),
    [dismissToast, showToast],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-[100] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-3 sm:right-6 sm:top-6">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex gap-3 rounded-lg border p-4 shadow-xl backdrop-blur ${toastStyles[toast.type]}`}
            role="status"
          >
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconStyles[toast.type]}`}>
              <ToastIcon type={toast.type} />
            </div>
            <div className="min-w-0 flex-1">
              {toast.title && <p className="text-sm font-semibold leading-5">{toast.title}</p>}
              <p className="text-sm leading-5 text-gray-600">{toast.message}</p>
            </div>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="rounded-md p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
