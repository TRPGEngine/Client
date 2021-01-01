import _isString from 'lodash/isString';
import _get from 'lodash/get';

const imageUrlRE = /<img.*?src="(.*?)"/;

/**
 * 从HTML中提取第一张图片
 * @param html HTML字符串
 */
export function getFirstImageUrlFromHTML(html: string): string | null {
  const res = html.match(imageUrlRE);
  const url = _get(res, [1]);

  if (_isString(url)) {
    return url;
  }

  return null;
}
