import React, { useCallback, useMemo, useContext } from 'react';
import { TagComponent } from '../type';
import { Button } from 'antd';
import _isNil from 'lodash/isNil';
import { roll } from './shared';
import { LayoutStateContext } from '../../context/LayoutStateContext';
import { setStateValue } from '../utils';

interface TagProps {
  label?: string;
}
export const TagRollBtnEdit: TagComponent<TagProps> = React.memo((props) => {
  const context = useContext(LayoutStateContext);

  const items = useMemo(() => {
    return props._childrenEl.map((e) => {
      const attr = e.attributes;
      return {
        dice: String(attr.dice),
        target: String(attr.target),
      };
    });
  }, [props._childrenEl]);

  const handleRoll = useCallback(() => {
    items.forEach((item) => {
      if (_isNil(item.dice) || _isNil(item.target)) {
        return;
      }

      const { result, str, value } = roll(item.dice);

      if (result === true) {
        setStateValue(context, item.target, value);
      } else {
        console.error('表达式出错', item.dice, str);
      }
    });
  }, [context]);

  return (
    <Button type="primary" onClick={handleRoll}>
      {props.label ?? '投骰'}
    </Button>
  );
});
TagRollBtnEdit.displayName = 'TagRollBtnEdit';
