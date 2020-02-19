import React, { useCallback, useMemo } from 'react';
import { TagComponent } from '../type';
import { useLayoutFormData } from '@shared/components/layout/hooks/useLayoutFormData';
import { InputNumber } from 'antd';
import { useLayoutFormContainer } from '../../hooks/useLayoutFormContainer';
import { TagInputProps } from '../Input/shared';
import _isNil from 'lodash/isNil';
import { useToNumber } from '@shared/hooks/useToNumber';

interface TagProps extends TagInputProps {
  max?: number;
  min?: number;
  step?: number;
}
export const TagInputNumberEdit: TagComponent<TagProps> = React.memo(
  (props) => {
    const { label, placeholder, stateValue, setStateValue } = useLayoutFormData(
      props
    );

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

    return (
      <FormContainer label={label}>
        <InputNumber
          style={{ width: '100%' }}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          disabled={props.disabled}
        />
      </FormContainer>
    );
  }
);
TagInputNumberEdit.displayName = 'TagInputNumberEdit';
