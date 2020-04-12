import React, { ComponentType, ReactNode } from 'react';
import { TagProps, AstNode } from './type';
import { parse } from '@bbob/parser';
import _last from 'lodash/last';
import _get from 'lodash/get';
import _has from 'lodash/has';
import _isObject from 'lodash/isObject';
import _isArray from 'lodash/isArray';
import _isEmpty from 'lodash/isEmpty';

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

const DefaultBBCodeComponent: React.FC<TagProps> = React.memo((props) => {
  if (_has(tagMap, '_text')) {
    const Component = tagMap['_text'] as StringTagComponent;
    return <Component>{props.node.content.join('')}</Component>;
  } else {
    return null;
  }
});
DefaultBBCodeComponent.displayName = 'DefaultBBCodeComponent';

/**
 * 获取BBCode标签组件
 */
export const getBBCodeTag = (tagName: string): TagMapComponent => {
  return tagMap[tagName] ?? DefaultBBCodeComponent;
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

  // 将bbcode字符串转化为AstNode
  parse(input: string): AstNode[] {
    try {
      return parse(input, this.options).map((node: any) => {
        if (_isObject(node)) {
          const content = _get(node, 'content');
          const attrs = _get(node, 'attrs');

          if (_isEmpty(attrs) && _isArray(content) && content.length === 0) {
            // 如果是[text]这种格式的话会被误解析成一个节点
            // 做一下特殊处理
            // NOTICE: 这种处理方式会将[url][/url]解析成字符串[url]
            // 最好的解决方案是自己写一个BBCode的词法解释器
            const tag = _get(node, 'tag');
            if (typeof tag === 'string') {
              return `[${tag}]`;
            }
          }
        }

        return node;
      });
    } catch (e) {
      console.warn(e);
      return [];
    }
  }

  render(input: string): ReactNode[] {
    const ast = this.parse(input);

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

        if (typeof node === 'object') {
          const Component = getBBCodeTag(node.tag);
          return <Component key={index} node={node} />;
        }

        return null;
      });
  }
}

const bbcodeParser = new BBCodeParser();

export default bbcodeParser;
