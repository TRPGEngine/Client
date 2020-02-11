import parseInlineStyle from 'style-to-object';
import _isNil from 'lodash/isNil';
import _set from 'lodash/set';

/**
 * 将属性的style对象解析为react可以使用的类型
 * 如果解析失败则移除style属性
 * @param attr 属性
 */
export const parseAttrStyle = (attr) => {
  if (!_isNil(attr) && !_isNil(attr.style) && typeof attr.style === 'string') {
    try {
      _set(attr, 'style', parseInlineStyle(attr.style));
    } catch (e) {
      console.error('parse style error', e);
      delete attr.style;
    }
  }

  return attr;
};
