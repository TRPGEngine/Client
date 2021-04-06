import axios from 'axios';
import { fileUrl } from '../api/trpg.api';
import _set from 'lodash/set';
import _isFunction from 'lodash/isFunction';
import _isNil from 'lodash/isNil';
import { request } from './request';

export interface UploadOption {
  headers?: {};
  uploadField?: string;
  onProgress?: (percent: number, progressEvent: any) => void;
  onCompleted?: (data: any) => void;
}
export type UploadReturn<T = any> = Promise<T>;

export type AvatarUploadOption = Omit<
  UploadOption,
  'uploadField' | 'onCompleted'
>;

export interface AvatarUpdateData {
  url: string;
  isLocal: string; // 是否存在单机本地
  uuid: string; // 对应头像的UUID
}

export const generateFileMsgData = function (file) {
  const tmp = file.name.split('.');
  return {
    originalname: file.name,
    size: file.size,
    ext: tmp[tmp.length - 1],
    progress: 0,
  };
};

/**
 * 上传到服务器
 * file api
 * @deprecated 应该使用通用的jwt校验机制
 * 可参考 toPersistenceImage
 */
const _upload = function (
  path: string,
  userUUID: string,
  file: File,
  options?: UploadOption
) {
  const form = new FormData();
  form.append(options?.uploadField || 'file', file);
  return axios({
    url: fileUrl + path,
    method: 'post',
    data: form,
    headers: {
      'user-uuid': userUUID,
      ...options?.headers,
    },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.lengthComputable) {
        options &&
          _isFunction(options.onProgress) &&
          options.onProgress(
            progressEvent.loaded / progressEvent.total,
            progressEvent
          );
      }
    },
  })
    .then((res) => {
      options &&
        _isFunction(options.onCompleted) &&
        options.onCompleted(res.data);
      return res.data;
    })
    .catch((err) => {
      console.error('上传失败', err, JSON.stringify(err));
      throw err;
    });
};

/**
 * @deprecated
 * 上传到临时文件
 * @param userUUID 用户UUID
 * @param file 文件名
 * @param options 其他选项
 */
export const toTemporary = function (
  userUUID: string,
  file: File,
  options?: UploadOption
): UploadReturn {
  return _upload('/upload/temporary', userUUID, file, options);
};

/**
 * @deprecated
 * 上传到永久文件夹
 * @param userUUID 用户UUID
 * @param file 文件名
 * @param options 其他选项
 */
export const toPersistence = function (
  userUUID: string,
  file: File,
  options?: UploadOption
): UploadReturn {
  return _upload('/upload/persistence', userUUID, file, options);
};

/**
 * 上传到头像目录
 * @param userUUID 用户UUID
 * @param file 文件名
 * @param options 其他选项
 */
export async function toAvatar(
  /**
   * @deprecated 该参数被弃用
   */
  userUUID: string,
  file: File,
  options: AvatarUploadOption = {}
): Promise<AvatarUpdateData> {
  if (_isNil(userUUID)) {
    throw new Error('当前未登录, 无法上传头像');
  }

  const form = new FormData();
  form.append('avatar', file);
  const { data } = await request.post('/file/v2/avatar/upload', form, {
    headers: options.headers,
    onUploadProgress(progressEvent) {
      if (progressEvent.lengthComputable) {
        options &&
          _isFunction(options.onProgress) &&
          options.onProgress(
            progressEvent.loaded / progressEvent.total,
            progressEvent
          );
      }
    },
  });

  return data;
}

/**
 * 类似于toAvatar， 但是avatar-type会被设置为团角色
 */
export const toGroupAvatar = function (
  userUUID: string,
  file: File,
  options: AvatarUploadOption = {}
): UploadReturn<AvatarUpdateData> {
  _set(options, 'headers.avatar-type', 'groupActor');
  return toAvatar(userUUID, file, options);
};

interface ToPersistenceImageOptions {
  /**
   * 图片用途:
   * - note
   */
  usage?: string;
  attachUUID?: string;
  onProgress?: (percent: number, progressEvent: any) => void;
}
interface ToPersistenceImageRet {
  url: string;
  isLocal: boolean;
  uuid: string;
}
/**
 * 上传持久化图片(通用)
 * NOTICE: 这个上传是占用服务器带宽来上传的
 */
export async function toPersistenceImage(
  file: File,
  options: ToPersistenceImageOptions = {}
): Promise<ToPersistenceImageRet> {
  const { usage, attachUUID } = options;
  const form = new FormData();
  form.append('image', file);
  const { data } = await request.post('/file/v2/image/upload', form, {
    headers: {
      usage,
      'attach-uuid': attachUUID,
    },
    onUploadProgress(progressEvent) {
      if (progressEvent.lengthComputable) {
        options &&
          _isFunction(options.onProgress) &&
          options.onProgress(
            progressEvent.loaded / progressEvent.total,
            progressEvent
          );
      }
    },
  });

  return data;
}
