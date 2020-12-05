import _isString from 'lodash/isString';
import urlRegex from 'url-regex';
import config from '@shared/project.config';
import str2int from 'str2int';
import { resolve as resolveUrl } from 'url';

/**
 * 判断一个字符串是否是url
 * @param str 要判断的字符串
 */
export function isUrl(str: string) {
  return urlRegex({ exact: true }).test(str);
}

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

/**
 * 根据文本内容返回一个内置色卡的颜色
 * @param text 文本
 */
export function getTextColorHex(text: string): string {
  if (!text || !_isString(text)) {
    return '#ffffff'; // 如果获取不到文本，则返回白色
  }

  const color = config.defaultImg.color;
  const id = str2int(text);
  return color[id % color.length];
}

export function getAvatarColorHex(name: string) {
  return getTextColorHex(name);
}

/**
 * 获取portal地址
 * @param url portal路径
 */
export function getPortalUrl(url: string): string {
  const portalUrl = config.url.portal;

  if (url.startsWith(portalUrl)) {
    return url;
  } else {
    if (!url.startsWith('/')) {
      url = '/' + url;
    }

    return portalUrl + url;
  }
}

/**
 * 获取文档地址
 * @param url 文档路径
 */
export function getDocsUrl(url: string): string {
  const docsUrl = config.url.docs;
  return url.startsWith(docsUrl) ? url : resolveUrl(docsUrl, url);
}
