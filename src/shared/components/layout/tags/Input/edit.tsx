import React, { useCallback, useMemo } from 'react';
import { TagComponent } from '../type';
import { TagInputProps } from './shared';
import { TMemo } from '@shared/components/TMemo';
import { useLayoutFormData } from '@shared/components/layout/hooks/useLayoutFormData';
import { Input } from 'antd';
import { tryToNumber } from '../utils';
import { useLayoutFormContainer } from '../../hooks/useLayoutFormContainer';

export const TagInputEdit: TagComponent<TagInputProps> = TMemo((props) => {
  const { label, placeholder, stateValue, setStateValue } = useLayoutFormData(
    props
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;

      setStateValue(tryToNumber(value));
    },
    [setStateValue]
  );

  const FormContainer = useLayoutFormContainer(props);

  return useMemo(
    () => (
      <FormContainer label={label}>
        <Input
          placeholder={placeholder}
          value={stateValue}
          onChange={handleChange}
          disabled={props.disabled}
        />
      </FormContainer>
    ),
    [label, placeholder, stateValue, handleChange, props.disabled]
  );
});
TagInputEdit.displayName = 'TagInputEdit';
