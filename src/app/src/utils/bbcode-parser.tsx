import React, { ReactElement } from 'react';
import { Text } from 'react-native';
import { parse } from '@bbob/parser';
import ImageTag from './bbcode/ImageTag';
import { AstNode } from './bbcode/types';
import _has from 'lodash/has';
import _last from 'lodash/last';
import UrlTag from './bbcode/UrlTag';

const tagMap = {
  img: ImageTag,
  url: UrlTag,
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

  parse(input: string): ReactElement[] {
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
      .map<ReactElement>((node, index) => {
        if (typeof node === 'string') {
          return <Text key={index}>{node}</Text>;
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
