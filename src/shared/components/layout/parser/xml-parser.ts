// TODO: 之后可能为了效率需要用htmlparser2进行底层修改。目前先用现成的
import convert from 'xml-js';
import _isNil from 'lodash/isNil';
import _get from 'lodash/get';
import _set from 'lodash/set';
import _isArray from 'lodash/isArray';

const parser = (xml: string): XMLElement => {
  try {
    console.time('xml解析用时');
    const js = convert.xml2js(xml, {
      compact: false,
      trim: true,
    }) as XMLElement;
    console.timeEnd('xml解析用时');
    return js;
  } catch (error) {
    console.error('解释XML失败:', xml);
    throw error;
  }
};

export default parser;

export type XMLElement = convert.Element;
export type XMLElementAttributes = convert.Attributes;

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
