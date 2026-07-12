import { AxiosRequestConfig, AxiosResponse } from 'axios'
import { apiService } from './api.service'

/**
 * Generic base API wrapper that delegates to the global apiService instance.
 * Kept for backward-compatibility with existing code that uses BaseAPI.get(), etc.
 */
class BaseApiService {
  get<T = any>(path: string, params?: any): Promise<AxiosResponse<T>> {
    return apiService.get<T>(path, { params })
  }

  post<T = any>(path: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return apiService.post<T>(path, data, config)
  }

  put<T = any>(path: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return apiService.put<T>(path, data, config)
  }

  delete<T = any>(path: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return apiService.delete<T>(path, config)
  }
}

export const baseApiService = new BaseApiService()

/** @deprecated Use baseApiService instead */
export const BaseAPI = baseApiService

export default BaseApiService
