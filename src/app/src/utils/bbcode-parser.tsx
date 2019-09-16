import React, { ReactElement } from 'react';
import { Text } from 'react-native';
import { parse } from '@bbob/parser';
import ImageTag from './bbcode/ImageTag';
import { AstNode } from './bbcode/types';
import _has from 'lodash/has';
import _last from 'lodash/last';

const tagMap = {
  img: ImageTag,
};

/**
 * BBCode 解析器
 */
class BBCodeParser {
  options = {
    onlyAllowTags: ['img'],
    onError: (err) => {
      console.warn(err.message, err.lineNumber, err.columnNumber);
    },
  };

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
