import React from 'react';
import styled from 'styled-components';
import { Tooltip, Icon } from 'antd';
import _isEmpty from 'lodash/isEmpty';

export interface TagInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  desc?: string;
}

export const LabelContainer = styled.div`
  display: flex;
  align-items: center;
`;

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

export const LabelTip: React.FC<{ tip: string }> = React.memo((props) => {
  if (_isEmpty(props.tip)) {
    return null;
  }

  return (
    <Tooltip title={props.tip} trigger="hover">
      <Icon type="question-circle-o" />
    </Tooltip>
  );
});
LabelTip.displayName = 'LabelTip';

export const TagLabel: React.FC<{ label: string; desc: string }> = React.memo(
  (props) => {
    return (
      <LabelContainer>
        <Label title={props.label} />
        &nbsp;
        <LabelTip tip={props.desc} />
      </LabelContainer>
    );
  }
);
