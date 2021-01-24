import React, { useMemo } from 'react';
import type { TagComponent } from '../type';
import { useLayoutChildren } from '../../hooks/useLayoutChildren';
import { normalizeTagName, removePrivateProps } from '../utils';
import styled from 'styled-components';
import { Row } from 'antd';
import { TMemo } from '@shared/components/TMemo';

// defined from facebook/react/packages/react-dom/src/shared/voidElementTags.js
// https://github.com/facebook/react/blob/b0657fde6a/packages/react-dom/src/shared/voidElementTags.js
export const voidElementTags = [
  'menuitem',
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'keygen',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
];

export const blacklistTags = [
  'script',
  'style',
  'meta',
  'head',
  'body',
  'html',
];

export const TagBaseShared: TagComponent = TMemo((props) => {
  const tagName = props._name;
  let childrens = useLayoutChildren(props);
  const tagProps = useMemo(() => removePrivateProps(props), [props]);

  if (blacklistTags.includes(tagName)) {
    return null;
  }

  if (voidElementTags.includes(tagName)) {
    childrens = undefined;
  }

  const Tag = normalizeTagName(tagName);

  if (Tag === React.Fragment) {
    return React.createElement(Tag, {}, childrens);
  }

  // 是HTML元素
  return React.createElement(Tag, tagProps, childrens);
});
TagBaseShared.displayName = 'TagBaseShared';

export const BaseTypeRow = styled(Row).attrs({
  className: 'tag-row',
})`
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
`;
