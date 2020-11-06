import axios from 'axios';
import { fileUrl } from '@shared/api/trpg.api';
import memoizeOne from 'memoize-one';
import _get from 'lodash/get';
import _invoke from 'lodash/invoke';
import { request } from './request';

/**
 * 获取聊天图片上传信息
 */
interface UploadInfo {
  url: string;
  imageField: string;
  imagePath: string;
  otherData?: {};
}
export const getUploadInfo = memoizeOne(
  (): Promise<UploadInfo> => {
    return request('/file/chatimg/upload/info').then((res) => res.data);
  }
);

/**
 * 上传聊天图片
 */
interface UploadChatCallback {
  onUploadProgress: (percent: number) => void;
}
export const uploadChatimg = async (
  file: File,
  callback?: UploadChatCallback
): Promise<string> => {
  const { url, imageField, otherData, imagePath } = await getUploadInfo();

  const form = new FormData();
  form.append(imageField, file);
  for (const key in otherData) {
    if (otherData.hasOwnProperty(key)) {
      const val = otherData[key];
      form.append(key, val);
    }
  }

  const { data } = await axios.post(url, form, {
    onUploadProgress(progressEvent) {
      const { loaded = 0, total = 1 } = progressEvent;
      _invoke(callback, 'onUploadProgress', loaded / total);
    },
  });
  const imageUrl = _get(data, imagePath, '');

  return imageUrl;
};
