import parseInlineStyle from 'style-to-object';
import _isNil from 'lodash/isNil';
import _set from 'lodash/set';
import _mapKeys from 'lodash/mapKeys';
import _camelCase from 'lodash/camelCase';

/**
 * 将属性的style对象解析为react可以使用的类型
 * 如果解析失败则移除style属性
 * @param attr 属性
 */
export const parseAttrStyle = (attr) => {
  if (!_isNil(attr) && !_isNil(attr.style) && typeof attr.style === 'string') {
    try {
      const obj = parseInlineStyle(attr.style);
      const reactStyleObj = _mapKeys(obj, (val, key) => _camelCase(key));
      _set(attr, 'style', reactStyleObj);
    } catch (e) {
      console.error('parse style error', e);
      delete attr.style;
    }
  }

  return attr;
};
