import { toNetwork } from './imageUploader';

export const isPasteImage = function(items) {
  let i = 0;
  let item;
  while (i < items.length) {
    item = items[i];
    if (item.type.indexOf('image') !== -1) {
      return item;
    }
    i++;
  }
  return false;
};

export const upload = function(userUUID, file) {
  return toNetwork(userUUID, file);
};
