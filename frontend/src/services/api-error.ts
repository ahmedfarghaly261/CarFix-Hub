import type { AxiosError } from 'axios'

interface ApiErrorResponse {
  message?: string
  error?: string
}

/**
 * Extracts a human-readable error message from an unknown error value.
 * Works for both Axios errors and generic JS errors.
 */
export function getApiErrorMessage(error: unknown): string {
  const axiosError = error as AxiosError<ApiErrorResponse>

  return (
    axiosError.response?.data?.message ||
    axiosError.response?.data?.error ||
    axiosError.message ||
    'Something went wrong'
  )
}
