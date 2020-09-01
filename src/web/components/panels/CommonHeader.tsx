import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { SectionHeader } from '../SectionHeader';
import styled from 'styled-components';
import { Space } from 'antd';

const Container = styled.div`
  display: flex;
  font-size: 20px;
`;

const HeaderPrefix = styled.span`
  color: ${(props) => props.theme.color.gray};
  margin-right: 4px;
`;

const HeaderText = styled.span`
  flex: 1;
  font-size: 16px;
  line-height: 28px;
`;

interface CommonHeaderProps {
  headerPrefix?: React.ReactNode;
  headerActions?: React.ReactNode[];
}
export const CommonHeader: React.FC<CommonHeaderProps> = TMemo((props) => {
  const { headerActions } = props;

  return (
    <SectionHeader>
      <Container>
        <HeaderPrefix>{props.headerPrefix}</HeaderPrefix>
        <HeaderText>{props.children}</HeaderText>
        <Space>{headerActions}</Space>
      </Container>
    </SectionHeader>
  );
});
CommonHeader.displayName = 'CommonHeader';
