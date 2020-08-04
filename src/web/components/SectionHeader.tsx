import React from 'react';
import styled from 'styled-components';
import { TMemo } from '@shared/components/TMemo';
import { Dropdown } from 'antd';
import { Iconfont } from './Iconfont';

export const SectionHeaderContainer = styled.div`
  height: ${(props) => props.theme.style.sectionHeight};
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 16px;
  font-size: 16px;
  font-weight: bold;
  flex-shrink: 0;

  &::after {
    content: ' ';
    position: absolute;
    display: block;
    bottom: 1px;
    left: 0;
    right: 0;
    height: 1px;
    box-shadow: ${(props) => props.theme.boxShadow.elevationLow};
    z-index: 1;
    pointer-events: none;
  }

  header {
    ${(props) => props.theme.mixins.oneline}

    flex: 1;
  }

  .clickable-header {
    cursor: pointer;
    display: flex;
    flex: 1;
  }
`;

interface SectionHeaderProps {
  menu?: React.ReactElement;
}

export const SectionHeader: React.FC<SectionHeaderProps> = TMemo((props) => {
  return (
    <SectionHeaderContainer>
      {React.isValidElement(props.menu) ? (
        <Dropdown overlay={props.menu} placement="topRight" trigger={['click']}>
          <div className="clickable-header">
            <header>{props.children}</header>
            <Iconfont>&#xe60f;</Iconfont>
          </div>
        </Dropdown>
      ) : (
        <header>{props.children}</header>
      )}
    </SectionHeaderContainer>
  );
});
SectionHeader.displayName = 'SectionHeader';
