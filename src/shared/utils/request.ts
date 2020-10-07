import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import config from '@shared/project.config';
import _get from 'lodash/get';
import _isString from 'lodash/isString';
import _isNil from 'lodash/isNil';
import _isFunction from 'lodash/isFunction';
import { getErrorHook, tokenGetter } from '@shared/manager/request';
import { errorCode } from './error';
import { showLimitedToasts } from './ui';

const fileUrl = config.file.url;

interface CommonResp {
  result: string;
  msg?: string;
}

/**
 * @deprecated 旧版请求接口
 */
export default async function requestOld<T = any>(
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

// ====================以下为新版请求接口

/**
 * 创建请求实例
 */
export function createRequest() {
  const ins = axios.create({
    baseURL: config.url.api,
  });

  ins.interceptors.request.use(async (val) => {
    if (
      ['post', 'get'].includes(String(val.method).toLowerCase()) &&
      !val.headers['X-Token']
    ) {
      // 任何请求都尝试增加token
      val.headers['X-Token'] = await tokenGetter();
    }

    return val;
  });

  ins.interceptors.response.use(
    (val) => {
      return val;
    },
    (err) => {
      // 尝试获取错误信息
      const errorMsg: string = _get(err, 'response.data.msg');
      const code: number = _get(err, 'response.data.code');
      if (_isFunction(getErrorHook)) {
        const isContinue = getErrorHook(err);
        if (isContinue === false) {
          return { data: { result: false, msg: errorMsg, code } };
        }
      }

      if (!_isNil(code)) {
        if (code === errorCode.LIMITED) {
          showLimitedToasts();
        }
      }

      throw errorMsg ?? err;
    }
  );

  return ins;
}

export const request = createRequest();
