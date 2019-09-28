import { toNetwork } from './image-uploader';

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

export const upload = function(userUUID: string, file: File) {
  return toNetwork(userUUID, file);
};
