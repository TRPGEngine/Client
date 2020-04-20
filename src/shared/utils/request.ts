import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import config from '../project.config';

const fileUrl = config.file.url;

interface CommonResp {
  result: string;
  msg?: string;
}

export default async function request<T = any>(
  path: string,
  method: 'get' | 'post' = 'get',
  data?: any,
  options?: Omit<AxiosRequestConfig, 'params' | 'data'>
): Promise<AxiosResponse<T & CommonResp>> {
  const ext: AxiosRequestConfig = {};
  if (method === 'get') {
    ext.params = data;
  } else if (method === 'post') {
    ext.data = data;
  }

  const res = await axios({
    url: fileUrl + path,
    method,
    ...options,
    ...ext,
  });

  return res;
}
