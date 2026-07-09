import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

class ApiService {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      withCredentials: true,
    })

    this.setupResponseInterceptor()
  }

  private setupResponseInterceptor() {
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        // Let individual components handle 401 to avoid reload loops
        return Promise.reject(error)
      },
    )
  }

  get<T = any>(url: string, config?: AxiosRequestConfig) {
    return this.api.get<T>(url, config)
  }

  post<T = any, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig) {
    return this.api.post<T>(url, data, config)
  }

  put<T = any, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig) {
    return this.api.put<T>(url, data, config)
  }

  patch<T = any, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig) {
    return this.api.patch<T>(url, data, config)
  }

  delete<T = any>(url: string, config?: AxiosRequestConfig) {
    return this.api.delete<T>(url, config)
  }
}

export const apiService = new ApiService()
export default apiService
