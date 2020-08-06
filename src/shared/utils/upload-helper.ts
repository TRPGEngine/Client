import axios from 'axios';
import { fileUrl } from '../api/trpg.api';
import _set from 'lodash/set';
import _isFunction from 'lodash/isFunction';

export interface UploadOption {
  headers?: {};
  uploadField?: string;
  onProgress?: (percent: number, progressEvent: any) => void;
  onCompleted?: (data: any) => void;
}
export type UploadReturn<T = any> = Promise<T>;

export interface AvatarUpdateData {
  url: string;
  isLocal: string; // 是否存在单机本地
  uuid: string; // 对应头像的UUID
}

export const generateFileMsgData = function(file) {
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
 */
const _upload = function(
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
 * 上传到临时文件
 * @param userUUID 用户UUID
 * @param file 文件名
 * @param options 其他选项
 */
export const toTemporary = function(
  userUUID: string,
  file: File,
  options?: UploadOption
): UploadReturn {
  return _upload('/upload/temporary', userUUID, file, options);
};

/**
 * 上传到永久文件夹
 * @param userUUID 用户UUID
 * @param file 文件名
 * @param options 其他选项
 */
export const toPersistence = function(
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
export const toAvatar = function(
  userUUID: string,
  file: File,
  options: UploadOption = {}
): UploadReturn<AvatarUpdateData> {
  options.uploadField = 'avatar';
  return _upload('/v2/avatar/upload', userUUID, file, options);
};

/**
 * 类似于toAvatar， 但是avatar-type会被设置为团角色
 */
export const toGroupAvatar = function(
  userUUID: string,
  file: File,
  options: UploadOption = {}
): UploadReturn<AvatarUpdateData> {
  _set(options, 'headers.avatar-type', 'groupActor');
  return toAvatar(userUUID, file, options);
};
