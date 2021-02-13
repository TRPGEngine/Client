import axios, { AxiosRequestConfig, AxiosPromise } from 'axios';
import { reportError } from './error';

export function request<T = any>(config: AxiosRequestConfig): AxiosPromise<T> {
  return axios(config).catch((err) => {
    reportError(err);
    throw err;
  });
}
