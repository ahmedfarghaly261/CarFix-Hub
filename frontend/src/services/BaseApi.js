import API from './api';

class BaseApi {
  constructor(apiInstance) {
    this.api = apiInstance;
  }

  get(path, params) {
    return this.api.get(path, { params });
  }

  post(path, data, config) {
    return this.api.post(path, data, config);
  }

  put(path, data, config) {
    return this.api.put(path, data, config);
  }

  delete(path, config) {
    return this.api.delete(path, config);
  }
}

export const BaseAPI = new BaseApi(API);
export default BaseApi;
