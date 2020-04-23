import React, { useCallback, useMemo, Fragment } from 'react';
import { TagComponent } from '../type';
import { TMemo } from '@shared/components/TMemo';
import { useToBoolean } from '@shared/hooks/useToBoolean';
import { useLayoutFieldState } from '../../hooks/useLayoutFieldState';
import { Button } from 'antd';
import { TagCustomListSharedProps, TagCustomListShared } from './shared';
import _isNil from 'lodash/isNil';

/**
 * 该组件不同于ForEach
 * ForEach是取layout的数据作为数据源
 * 而该组件是取当前state的数据作为数据源
 * 相比之下ForEach更加纯粹
 */

interface TagProps extends TagCustomListSharedProps {
  newBtn?: boolean;
}
export const TagCustomListEdit: TagComponent<TagProps> = TMemo((props) => {
  const newBtn = useToBoolean(props.newBtn);
  const [stateValue, setStateValue] = useLayoutFieldState(props.name);

  const handleAppendNewItem = useCallback(() => {
    if (_isNil(stateValue)) {
      setStateValue([{}]);
    } else if (Array.isArray(stateValue)) {
      // 仅当前字段存储的数据为一个集合时生效
      setStateValue([...stateValue, {}]);
    }
  }, [stateValue, setStateValue]);

  const newBtnEl = useMemo(() => {
    return (
      newBtn && (
        <Button type="link" onClick={handleAppendNewItem}>
          新增
        </Button>
      )
    );
  }, [newBtn, handleAppendNewItem]);

  return (
    <Fragment>
      <TagCustomListShared {...props} />
      {newBtnEl}
    </Fragment>
  );
});
TagCustomListEdit.displayName = 'TagCustomListEdit';
TagCustomListEdit.defaultProps = {
  newBtn: true,
};
