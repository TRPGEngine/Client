import React, { useMemo } from 'react';
import styled from 'styled-components';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import _isEmpty from 'lodash/isEmpty';
import { TMemo } from '@shared/components/TMemo';
import { useMultilineText } from '../../hooks/useMultilineText';

export interface TagInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  desc?: string;
  disabled?: boolean;
  default?: string;
}

export const LabelContainer = styled.div`
  display: flex;
  align-items: center;
  padding-right: 4px;
`;

export const LabelBody = styled.pre`
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Label: React.FC<{ title: string }> = TMemo((props) => {
  return useMemo(
    () => (
      <Tooltip title={props.title} trigger="click">
        <LabelBody>{props.title}</LabelBody>
      </Tooltip>
    ),
    [props.title]
  );
});
Label.displayName = 'Label';

export const DetailText = styled.pre`
  white-space: pre-wrap;
  word-wrap: break-word;
`;

export const LabelTip: React.FC<{ tip: string }> = TMemo((props) => {
  if (_isEmpty(props.tip)) {
    return null;
  }

  const tip = useMultilineText(props.tip);

  return useMemo(
    () => (
      <Tooltip title={tip} trigger="hover">
        <QuestionCircleOutlined />
      </Tooltip>
    ),
    [tip]
  );
});
LabelTip.displayName = 'LabelTip';

export const TagLabel: React.FC<{ label: string; desc: string }> = TMemo(
  (props) => {
    return useMemo(
      () => (
        <LabelContainer>
          <Label title={props.label} />
          &nbsp;
          <LabelTip tip={props.desc} />
        </LabelContainer>
      ),
      [props.label, props.desc]
    );
  }
);
TagLabel.displayName = 'TagLabel';
