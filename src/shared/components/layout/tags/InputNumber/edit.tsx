import React, { useCallback, useMemo } from 'react';
import { TagComponent } from '../type';
import { useLayoutFormData } from '@shared/components/layout/hooks/useLayoutFormData';
import { InputNumber } from 'antd';
import { useLayoutFormContainer } from '../../hooks/useLayoutFormContainer';
import { TagInputProps } from '../Input/shared';
import _isNil from 'lodash/isNil';
import { useToNumber } from '@shared/hooks/useToNumber';
import { TMemo } from '@shared/components/TMemo';

interface TagProps extends TagInputProps {
  max?: number;
  min?: number;
  step?: number;

  /**
   * 精度。默认为0 即只允许整数
   */
  precision?: number;
}
export const TagInputNumberEdit: TagComponent<TagProps> = TMemo((props) => {
  const { label, placeholder, stateValue, setStateValue } = useLayoutFormData(
    props
  );

  const precision = useToNumber(props.precision, 0);

  const handleChange = useCallback((value: number) => {
    setStateValue(value);
  }, []);

  const FormContainer = useLayoutFormContainer(props);

  const value = useMemo(() => {
    const num = Number(stateValue);
    if (isNaN(num)) {
      return null;
    } else {
      return num;
    }
  }, [stateValue]);

  const step = useToNumber(props.step);
  const min = useToNumber(props.min);
  const max = useToNumber(props.max);

  return useMemo(
    () => (
      <FormContainer label={label}>
        <InputNumber
          style={{ width: '100%' }}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          precision={precision}
          value={value}
          onChange={handleChange}
          disabled={props.disabled}
        />
      </FormContainer>
    ),
    [label, placeholder, min, max, step, value, handleChange, props.disabled]
  );
});
TagInputNumberEdit.displayName = 'TagInputNumberEdit';
TagInputNumberEdit.defaultProps = {
  default: '0',
};
