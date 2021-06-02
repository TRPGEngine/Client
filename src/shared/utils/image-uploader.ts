import _get from 'lodash/get';
import _invoke from 'lodash/invoke';
import { toPersistenceImage } from './upload-helper';

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
  const info = await toPersistenceImage(file, {
    usage: 'chatimg',
    onProgress: callback?.onUploadProgress,
  });
  return info.url;
};
