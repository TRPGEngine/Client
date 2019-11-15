import _isString from 'lodash/isString';

/**
 * 判断字符串是否是一个blobUrl
 * @param str url字符串
 */
export const isBlobUrl = (str: string) => {
  return _isString(str) && str.startsWith('blob:');
};
