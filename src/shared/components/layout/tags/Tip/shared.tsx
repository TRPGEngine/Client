import React, { useMemo, Fragment } from 'react';
import { TagComponent } from '../type';
import _isEqual from 'lodash/isEqual';
import _isString from 'lodash/isString';
import _isNil from 'lodash/isNil';
import { useLayoutChildren } from '../../hooks/useLayoutChildren';
import { Tooltip, Icon } from 'antd';
import { TMemo } from '@shared/components/TMemo';

export const TagTipShared: TagComponent = TMemo((props) => {
  const children = useLayoutChildren(props);

  const tip = useMemo(() => {
    return <Fragment>{children}</Fragment>;
  }, [children]);

  return (
    <Tooltip title={tip} trigger="hover">
      <Icon
        type="question-circle-o"
        style={{ paddingLeft: 4, paddingRight: 4 }}
      />
    </Tooltip>
  );
});
TagTipShared.displayName = 'TagTipShared';
