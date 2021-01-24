import type { TagComponent } from '../type';
import React, { useMemo } from 'react';
import { useLayoutFieldState } from '../../hooks/useLayoutFieldState';
import { Progress, Tooltip } from 'antd';
import type { ProgressSize } from 'antd/lib/progress/progress';
import styledTheme from '@shared/utils/theme';
import _isEmpty from 'lodash/isEmpty';
import { TMemo } from '@shared/components/TMemo';

export interface TagBarSharedProps {
  current: string;
  max: string;
  label?: string;
  color?: string;
  size?: ProgressSize;
}
export const TagBarShared: TagComponent<TagBarSharedProps> = TMemo((props) => {
  const [_current] = useLayoutFieldState(props.current);
  const [_max] = useLayoutFieldState(props.max);

  const current = useMemo(() => Number(_current) || 0, [_current]);
  const max = useMemo(() => Number(_max) || 0, [_max]);
  const label = props.label;
  const color = useMemo(
    () => props.color ?? styledTheme.color['atomic-tangerine'],
    [props.color]
  );

  const percent = useMemo(() => {
    return (current / max) * 100;
  }, [current, max]);

  const title = useMemo(() => {
    let text = `${current} / ${max}`;
    if (!_isEmpty(label)) {
      text = `${label}: ${text}`;
    }

    return text;
  }, [label, current, max]);

  return (
    <Tooltip title={title}>
      <Progress
        showInfo={false}
        strokeColor={color}
        percent={percent}
        size={props.size}
      />
    </Tooltip>
  );
});
TagBarShared.displayName = 'TagBarShared';
