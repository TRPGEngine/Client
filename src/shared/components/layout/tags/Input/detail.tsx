import React, { useMemo } from 'react';
import type { TagComponent } from '../type';
import { DetailText, TagInputProps, TagLabel } from './shared';
import { useLayoutFormData } from '@shared/components/layout/hooks/useLayoutFormData';
import { useLayoutFormContainer } from '../../hooks/useLayoutFormContainer';
import { TMemo } from '@shared/components/TMemo';

export const TagInputDetail: TagComponent<TagInputProps> = TMemo((props) => {
  const { label, stateValue } = useLayoutFormData(props);

  const FormContainer = useLayoutFormContainer(props);

  const displayText = useMemo(() => {
    if (typeof stateValue === 'object') {
      return JSON.stringify(stateValue);
    }

    return stateValue ?? '';
  }, [stateValue]);

  return (
    <FormContainer label={label}>
      <DetailText>{displayText}</DetailText>
    </FormContainer>
  );
});
TagInputDetail.displayName = 'TagInputDetail';
