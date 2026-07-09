import axios from 'axios'

interface ApiErrorResponse {
  message?: string
  error?: string
}

/**
 * Extracts a human-readable error message from an unknown error value.
 * Safely handles Axios errors, Error instances, strings, null/undefined, and plain objects.
 */
export function getApiErrorMessage(error: unknown): string {
  if (error == null) {
    return 'Something went wrong'
  }

  if (typeof error === 'string') {
    return error
  }

  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const data = error.response?.data
    return data?.message || data?.error || error.message || 'Something went wrong'
  }

  if (error instanceof Error) {
    return error.message || 'Something went wrong'
  }

  if (typeof error === 'object') {
    const obj = error as Record<string, unknown>
    if (typeof obj.message === 'string' && obj.message) {
      return obj.message
    }
    if (typeof obj.error === 'string' && obj.error) {
      return obj.error
    }
  }

  return 'Something went wrong'
}
