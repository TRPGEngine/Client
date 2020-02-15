import _isString from 'lodash/isString';
import urlRegex from 'url-regex';

/**
 * 判断字符串是否是一个blobUrl
 * @param str url字符串
 */
export const isBlobUrl = (str: string) => {
  return _isString(str) && str.startsWith('blob:');
};

/**
 * 获取一段字符串中的所有url
 * @param str 字符串
 */
export const getUrls = (str: string): string[] => {
  return str.match(urlRegex()) ?? [];
};

/**
 * 用于判定环境变量的值
 */
export function is(it: string) {
  return !!it && it !== '0' && it !== 'false';
}
