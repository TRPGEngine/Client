import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import styled from 'styled-components';

const Container = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  right: 26px;

  i {
    color: ${(props) => props.theme.color.warning};
  }
`;

export const WarningFlag = TMemo(() => {
  return (
    <Container>
      <i className="iconfont">&#xe616;</i>
    </Container>
  );
});
WarningFlag.displayName = 'WarningFlag';
