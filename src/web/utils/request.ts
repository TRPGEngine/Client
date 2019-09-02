import axios, { AxiosRequestConfig, AxiosPromise } from 'axios';

export function request<T = any>(config: AxiosRequestConfig): AxiosPromise<T> {
  return axios(config).catch((err) => {
    import('./sentry').then((module) => module.error(err));
    throw err;
  });
}
