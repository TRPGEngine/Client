import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import styled from 'styled-components';

const Root = styled.div`
  width: 100%;
  height: 100%;
  position: absolute; /* 这行是为了让height: 100%能撑开 */
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Card = styled.div`
  box-shadow: ${(props) => props.theme.boxShadow.normal};
  border: ${(props) => props.theme.border.standard};
  border-radius: ${(props) => props.theme.radius.card};
  padding: 8px;
  max-width: 80%;
  max-height: 70%;
`;

/**
 * 一个居中卡片容器
 */

export const PortalCard: React.FC = TMemo((props) => {
  return (
    <Root>
      <Card>{props.children}</Card>
    </Root>
  );
});
PortalCard.displayName = 'PortalCard';
