import React from 'react';
import { Button, Col } from 'antd';
import styled from 'styled-components';
import { ButtonProps } from 'antd/lib/button';

const Container = styled(Col).attrs({
  xs: 24,
  sm: 8,
})`
  padding: 10px;
`;

export const ActionButton = React.memo((props: ButtonProps) => {
  return (
    <Container>
      <Button block={true} size="large" {...props} />
    </Container>
  );
});
