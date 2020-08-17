import React from 'react';
import styled from 'styled-components';
import _isString from 'lodash/isString';
import { TMemo } from '@shared/components/TMemo';

const FieldContainer = styled.div`
  margin-bottom: 16px;
`;

const FieldTitle = styled.div`
  font-size: 12px;
  line-height: 16px;
  color: ${(props) => props.theme.color.channelsDefault};
  margin-bottom: 8px;
`;

const FieldValue = styled.div`
  line-height: 40px;
  font-size: 16px;
  ${(props) => props.theme.mixins.oneline};
`;

export const FullModalField: React.FC<{
  title: string;
  value: React.ReactNode;
  editable?: boolean;
  onSave?: (val: string) => void;
}> = TMemo((props) => {
  const valueTitle = _isString(props.value) ? props.value : undefined;

  return (
    <FieldContainer>
      <FieldTitle>{props.title}</FieldTitle>
      <FieldValue title={valueTitle}>{props.value}</FieldValue>
    </FieldContainer>
  );
});
FullModalField.displayName = 'FullModalField';
