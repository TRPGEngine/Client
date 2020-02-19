import React, { useCallback } from 'react';
import { TagComponent } from '../type';
import { TagInputProps } from './shared';
import { useLayoutFormData } from '@shared/components/layout/hooks/useLayoutFormData';
import { Input } from 'antd';
import { tryToNumber } from '../utils';
import { useLayoutFormContainer } from '../../hooks/useLayoutFormContainer';

export const TagInputEdit: TagComponent<TagInputProps> = React.memo((props) => {
  const { label, placeholder, stateValue, setStateValue } = useLayoutFormData(
    props
  );

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setStateValue(tryToNumber(value));
  }, []);

  const FormContainer = useLayoutFormContainer(props);

  return (
    <FormContainer label={label}>
      <Input
        placeholder={placeholder}
        value={stateValue}
        onChange={handleChange}
        disabled={props.disabled}
      />
    </FormContainer>
  );
});
TagInputEdit.displayName = 'TagInputEdit';
