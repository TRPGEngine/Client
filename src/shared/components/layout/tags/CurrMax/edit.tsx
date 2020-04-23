import React, { useCallback, useEffect } from 'react';
import { TagComponent } from '../type';
import { TMemo } from '@shared/components/TMemo';
import { Input, InputNumber } from 'antd';
import { useLayoutFormData } from '../../hooks/useLayoutFormData';
import { TagInputProps } from '../Input/shared';
import { useLayoutFormContainer } from '../../hooks/useLayoutFormContainer';
import { useLayoutFieldState } from '../../hooks/useLayoutFieldState';
import { useToNumber } from '@shared/hooks/useToNumber';
import { TagCurrMaxSplitInput, buildMaxPropsName } from './shared';
import _isNil from 'lodash/isNil';

/**
 * 一个组合输入
 * 用于生成当前值与最大值的组合
 */

interface TagProps extends Omit<TagInputProps, 'default'> {
  default?: number;
  precision?: number;
}
export const TagCurrMaxEdit: TagComponent<TagProps> = TMemo((props) => {
  const defaultValue = useToNumber(props.default);
  const { label, placeholder, stateValue, setStateValue } = useLayoutFormData({
    ...props,
    default: defaultValue,
  });
  const [maxStateValue, setMaxStateValue] = useLayoutFieldState(
    buildMaxPropsName(props.name)
  );

  const FormContainer = useLayoutFormContainer(props);

  const currValue = useToNumber(stateValue);
  const maxValue = useToNumber(maxStateValue);

  const handleChangeCurrValue = useCallback(
    (num: number) => {
      setStateValue(num);
      if (maxValue < num) {
        setMaxStateValue(num);
      }
    },
    [setStateValue, maxValue, setMaxStateValue]
  );
  const handleChangeMaxValue = useCallback(
    (num: number) => {
      setMaxStateValue(num);
      if (currValue > num) {
        setStateValue(num);
      }
    },
    [setStateValue, currValue, setMaxStateValue]
  );

  // 处理最大值的默认值
  useEffect(() => {
    if (!_isNil(defaultValue) && _isNil(maxStateValue)) {
      setMaxStateValue(defaultValue);
    }
  }, [defaultValue]);

  const precision = useToNumber(props.precision, 0);

  return (
    <FormContainer label={label}>
      <Input.Group compact={true} style={{ display: 'flex' }}>
        <InputNumber
          style={{ flex: 1, textAlign: 'center' }}
          placeholder={`当前${placeholder}`}
          precision={precision}
          max={maxValue}
          value={currValue}
          onChange={handleChangeCurrValue}
        />
        <TagCurrMaxSplitInput />
        <InputNumber
          style={{
            flex: 1,
            textAlign: 'center',
            borderLeftWidth: 0,
          }}
          placeholder={`最大${placeholder}`}
          precision={precision}
          min={currValue}
          value={maxValue}
          onChange={handleChangeMaxValue}
        />
      </Input.Group>
    </FormContainer>
  );
});
TagCurrMaxEdit.displayName = 'TagCurrMaxEdit';
TagCurrMaxEdit.defaultProps = {
  precision: 0,
  default: 1,
};
