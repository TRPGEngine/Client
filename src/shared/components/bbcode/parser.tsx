import React, { ComponentType, ReactNode } from 'react';
import { TagProps, AstNode } from './type';
import { parse } from '@bbob/parser';
import _last from 'lodash/last';
import _has from 'lodash/has';

/**
 * 通用的bbcode解释器
 * 一个纯语言实现
 */

type StringTagComponent = ComponentType<{ children?: string }> | string;
type ObjectTagComponent = ComponentType<TagProps>;
type TagMapComponent = StringTagComponent | ObjectTagComponent;

const tagMap: { [tag: string]: TagMapComponent } = {};

/**
 * 注册一个组件到内部的tagMap中
 * @param tagName 标签名
 * @param component 组件
 */
export const registerBBCodeTag = (
  tagName: string,
  component: TagMapComponent
) => {
  tagMap[tagName] = component;
};

/**
 * BBCode 解析器
 */
class BBCodeParser {
  options = {
    onlyAllowTags: Object.keys(tagMap),
    onError: (err) => {
      console.warn(err.message, err.lineNumber, err.columnNumber);
    },
  };

  /**
   * 将文本中没有被bbcode标签包裹住的部分进行预处理后重新拼装成bbcode字符串
   */
  preProcessText(input: string, processFn: (text: string) => string): string {
    const ast = parse(input, this.options) as AstNode[];

    return ast
      .map((node, index) => {
        if (typeof node === 'string') {
          // 此处进行预处理
          const text = node;
          return processFn(text);
        }

        const { tag, content } = node;
        return `[${tag}]${content}[/${tag}]`;
      })
      .join('');
  }

  parse(input: string): ReactNode[] {
    const ast = parse(input, this.options) as AstNode[];

    return ast
      .reduce<AstNode[]>((prev, curr) => {
        if (typeof curr === 'string' && typeof _last(prev) === 'string') {
          // 合并字符串, 使其渲染时能公用一个Text组件
          prev[prev.length - 1] += curr;
        } else {
          prev.push(curr);
        }

        return prev;
      }, [])
      .map<ReactNode>((node, index) => {
        if (typeof node === 'string') {
          if (_has(tagMap, '_text')) {
            const Component = tagMap['_text'] as StringTagComponent;
            return <Component key={index}>{node}</Component>;
          } else {
            return node;
          }
        }

        if (typeof node === 'object' && _has(tagMap, node.tag)) {
          const Component = tagMap[node.tag];
          return <Component key={index} node={node} />;
        }

        return null;
      });
  }
}

const bbcodeParser = new BBCodeParser();

export default bbcodeParser;
