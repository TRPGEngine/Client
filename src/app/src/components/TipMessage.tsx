import styled from 'styled-components/native';
import React from 'react';

const TipContainer = styled.View`
  background-color: rgba(0, 0, 0, 0.1);
  /* width: 200px; */
  max-width: 200px;
  align-self: center;
  padding: 4px 10px;
  border-radius: 3px;
  margin: 5px 0;
`;

const TipText = styled.Text`
  color: white;
  font-size: 12px;
  line-height: 16px;
`;

export const TipMessage: React.FC<{ text: string }> = React.memo((props) => {
  return (
    <TipContainer>
      <TipText>{props.text}</TipText>
    </TipContainer>
  );
});
TipMessage.displayName = 'TipMessage';
