import React from 'react';
import { TagComponent } from '../type';
import { DetailText, TagInputProps, TagLabel } from './shared';
import { useLayoutFormData } from '@shared/components/layout/hooks/useLayoutFormData';
import { useLayoutFormContainer } from '../../hooks/useLayoutFormContainer';

export const TagInputDetail: TagComponent<TagInputProps> = React.memo(
  (props) => {
    const { label, stateValue } = useLayoutFormData(props);

    const FormContainer = useLayoutFormContainer(props);

    return (
      <FormContainer label={label}>
        <DetailText>{stateValue}</DetailText>
      </FormContainer>
    );
  }
);
TagInputDetail.displayName = 'TagInputDetail';
