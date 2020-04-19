import React from 'react';
import { TagComponent } from '../type';
import _isEqual from 'lodash/isEqual';
import _isString from 'lodash/isString';
import _isNil from 'lodash/isNil';
import { useLayoutChildren } from '../../hooks/useLayoutChildren';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { TMemo } from '@shared/components/TMemo';
import { useMultilineText } from '../../hooks/useMultilineText';

export const TagTipShared: TagComponent = TMemo((props) => {
  const children = useLayoutChildren(props);

  const tip = useMultilineText(children);

  return (
    <Tooltip title={tip} trigger="hover">
      <QuestionCircleOutlined style={{ paddingLeft: 4, paddingRight: 4 }} />
    </Tooltip>
  );
});
TagTipShared.displayName = 'TagTipShared';
