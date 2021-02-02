import type { XMLElement } from './xml-parser';
import _get from 'lodash/get';

/**
 * 获取仅存在固定标签的抽象结构树对象
 * NOTICE: 目前仅支持顶层 并强制返回一个Template容器
 */
export function getASTObjectWithTagName(
  ast: XMLElement,
  tagNameList: string[]
) {
  return {
    ...ast,
    elements: [
      {
        type: 'element',
        name: 'Template',
        elements: _get(
          ast,
          ['elements', 0, 'elements'],
          []
        ).filter((el: XMLElement) => tagNameList.includes(el.name ?? '')),
      },
    ],
  };
}

/**
 * 获取不存在固定标签的抽象结构树对象
 * NOTICE: 目前仅支持顶层
 */
export function getASTObjectWithoutTagName(
  ast: XMLElement,
  tagNameList: string[]
) {
  return {
    ...ast,
    elements: [
      {
        type: 'element',
        name: 'Template',
        elements: _get(ast, ['elements', 0, 'elements'], []).filter(
          (el: XMLElement) => !tagNameList.includes(el.name ?? '')
        ),
      },
    ],
  };
}
