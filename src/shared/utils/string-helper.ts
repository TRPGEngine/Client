import _isString from 'lodash/isString';
import urlRegex from 'url-regex';
import config from '@shared/project.config';
import str2int from 'str2int';

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

export function getAvatarColorHex(name: string) {
  if (!name) {
    return '#ffffff'; // 如果获取不到名字，则返回白色
  }

  const color = config.defaultImg.color;
  const id = str2int(name);
  return color[id % color.length];
}
