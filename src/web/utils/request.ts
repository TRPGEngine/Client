import axios, { AxiosRequestConfig, AxiosPromise } from 'axios';
import { reportError } from './error';

/**
 * @deprecated
 * 使用 @shared/utils/request
 */
export function request<T = any>(config: AxiosRequestConfig): AxiosPromise<T> {
  return axios(config).catch((err) => {
    reportError(err);
    throw err;
  });
}
