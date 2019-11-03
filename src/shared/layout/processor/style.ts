import parseInlineStyle from 'style-to-object';
import _isNil from 'lodash/isNil';

/**
 * 将属性的style对象解析为react可以使用的类型
 * @param attr 属性
 */
export const parseAttrStyle = (attr) => {
  try {
    if (
      !_isNil(attr) &&
      !_isNil(attr.style) &&
      typeof attr.style === 'string'
    ) {
      attr.style = parseInlineStyle(attr.style);
    }
  } catch (e) {
    console.error('parse style error', e);
  } finally {
    return attr;
  }
};
