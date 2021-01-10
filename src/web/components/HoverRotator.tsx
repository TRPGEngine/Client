import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import styled from 'styled-components';

const Root = styled.div`
  transition: transform 0.5s linear;
  transform: rotate(0deg);
  display: inherit; // 这一行是为了处理FullModal的按钮位置的问题
  align-items: center; // 这一行是为了处理笔记新增按钮的问题

  &:hover {
    transform: rotate(360deg);
  }
`;

interface HoverRotatorProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * 一个触发hover会将子元素进行快速旋转一圈的组件
 */
export const HoverRotator: React.FC<HoverRotatorProps> = TMemo((props) => {
  return <Root {...props}>{props.children}</Root>;
});
HoverRotator.displayName = 'HoverRotator';
