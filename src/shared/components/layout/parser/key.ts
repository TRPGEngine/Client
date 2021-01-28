import type { XMLElement } from './xml-parser';
import _set from 'lodash/set';
import _isNil from 'lodash/isNil';
import _isArray from 'lodash/isArray';

/**
 * 迭代配置唯一key
 */
export function iterativeConfigKey(node: XMLElement, prefix: string = 'root') {
  if (node.type === 'element' && _isNil(node.attributes?.key)) {
    _set(node, 'attributes.key', `${prefix}-${node.name}`);
  }

  if (_isArray(node.elements)) {
    node.elements.forEach((child, index) => {
      iterativeConfigKey(child, `${node.name ?? 'root'}-${index}`);
    });
  }
}
