import API from './api';
import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

class BaseApi {
  api: AxiosInstance;

  constructor(apiInstance: AxiosInstance) {
    this.api = apiInstance;
  }

  get<T = any>(path: string, params?: any): Promise<AxiosResponse<T>> {
    return this.api.get(path, { params });
  }

  post<T = any>(path: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.api.post(path, data, config);
  }

  put<T = any>(path: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.api.put(path, data, config);
  }

  delete<T = any>(path: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.api.delete(path, config);
  }
}

export const BaseAPI = new BaseApi(API);
export default BaseApi;
