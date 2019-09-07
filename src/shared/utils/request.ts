import axios, { AxiosResponse } from 'axios';
import config from '../project.config';

const fileUrl = config.file.url;

export default async function request<T = any>(
  path: string,
  method: 'get' | 'post',
  data: any
): Promise<AxiosResponse<T>> {
  const res = await axios({
    url: fileUrl + path,
    method,
    data,
  });

  return res;
}
