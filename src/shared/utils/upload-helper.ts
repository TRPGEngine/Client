import axios from 'axios';
import { fileUrl } from '../../api/trpg.api';

interface UploadOption {
  headers?: {};
  uploadField?: string;
  onProgress?: (percent: number, progressEvent: any) => void;
  onCompleted?: (data: any) => void;
}
type UploadReturn<T = any> = Promise<T>;

export const generateFileMsgData = function(file) {
  let tmp = file.name.split('.');
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
  form.append(options.uploadField || 'file', file);
  return axios({
    url: fileUrl + path,
    method: 'post',
    data: form,
    headers: {
      'user-uuid': userUUID,
      ...options.headers,
    },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.lengthComputable) {
        options &&
          options.onProgress &&
          options.onProgress(
            progressEvent.loaded / progressEvent.total,
            progressEvent
          );
      }
    },
  })
    .then((res) => {
      options && options.onCompleted && options.onCompleted(res.data);
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
): UploadReturn<{
  filename: string;
  url: string;
  size: number;
  avatar: any;
}> {
  options.uploadField = 'avatar';
  return _upload('/avatar', userUUID, file, options);
};
