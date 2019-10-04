import { toNetwork, uploadChatimg } from './image-uploader';

/**
 * 判定剪切板内是否为图片
 * @param items 剪切板数据列表
 */
export const isPasteImage = function(
  items: DataTransferItemList
): DataTransferItem | false {
  let i = 0;
  let item: DataTransferItem;
  while (i < items.length) {
    item = items[i];
    if (item.type.indexOf('image') !== -1) {
      return item;
    }
    i++;
  }
  return false;
};

/**
 * 上传剪切板内的文件
 * @param userUUID 用户uuid
 * @param file 文件
 */
export const upload = function(file: File): Promise<string> {
  return uploadChatimg(file);
};
