import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import config from '../project.config';

const fileUrl = config.file.url;

export default async function request<T = any>(
  path: string,
  method: 'get' | 'post' = 'get',
  data?: any
): Promise<AxiosResponse<T>> {
  const ext: AxiosRequestConfig = {};
  if (method === 'get') {
    ext.params = data;
  } else if (method === 'post') {
    ext.data = data;
  }

  const res = await axios({
    url: fileUrl + path,
    method,
    ...ext,
  });

  return res;
}
