import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { SectionHeader } from '../SectionHeader';
import styled from 'styled-components';
import { Space } from 'antd';

const Container = styled.div`
  display: flex;
  font-size: 20px;
  flex-wrap: wrap;
  justify-content: space-between;

  ${(props) => props.theme.mixins.mobile('padding: 8px 0;')}

  > div {
    display: flex;
    align-items: center;
  }
`;

const HeaderPrefix = styled.span`
  color: ${(props) => props.theme.color.gray};
  margin-right: 4px;
`;

const HeaderText = styled.span`
  font-size: 16px;
  line-height: 28px;
`;

const HeaderSuffix = styled.span`
  margin-left: 8px;
`;

const HeaderActionContainer = styled(Space)`
  ${(props) =>
    props.theme.mixins.mobile('width: 100%;justify-content: flex-end;')}
`;

interface CommonHeaderProps {
  headerPrefix?: React.ReactNode;
  headerActions?: React.ReactNode[];
  headerSuffix?: React.ReactNode;
}
export const CommonHeader: React.FC<CommonHeaderProps> = TMemo((props) => {
  return (
    <SectionHeader>
      <Container>
        <div>
          <HeaderPrefix>{props.headerPrefix}</HeaderPrefix>
          <HeaderText>{props.children}</HeaderText>
          <HeaderSuffix>{props.headerSuffix}</HeaderSuffix>
        </div>
        <HeaderActionContainer>{props.headerActions}</HeaderActionContainer>
      </Container>
    </SectionHeader>
  );
});
CommonHeader.displayName = 'CommonHeader';
