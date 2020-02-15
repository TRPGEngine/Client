import React from 'react';
import styled from 'styled-components';
import { Tooltip } from 'antd';

export const LabelBody = styled.pre`
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Label: React.FC<{ title: string }> = React.memo((props) => {
  return (
    <Tooltip title={props.title} trigger="click">
      <LabelBody>{props.title}</LabelBody>
    </Tooltip>
  );
});
Label.displayName = 'Label';

export const DetailText = styled.pre`
  white-space: pre-wrap;
  word-wrap: break-word;
`;
