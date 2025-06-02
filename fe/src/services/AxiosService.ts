import type { AxiosInstance } from 'axios'
import axiosLib from 'axios'
import { BaseEnvURLConfig } from '~/config/BaseURLs'
import { App } from 'vue'
import { useAuth, useClerk } from '@clerk/vue'

function init() {
  const axios = axiosLib.create()

  axios.defaults.baseURL = BaseEnvURLConfig.API;

  function includeCookies(axios: AxiosInstance) {
    const { getToken } = useAuth();

    axios.interceptors.request.use(async (config) => {
      const token = await getToken.value();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }

      config.withCredentials = true;
      return config
    }, error => Promise.reject(error))
  }

  includeCookies(axios)

  return axios;
}

let _axiosInstance: AxiosInstance;

export function $axios() {
  if (!_axiosInstance) {
    _axiosInstance = init();
  }

  return _axiosInstance;
}
