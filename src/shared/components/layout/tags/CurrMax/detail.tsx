import React from 'react';
import { TagComponent } from '../type';
import { TMemo } from '@shared/components/TMemo';
import { TagBarShared, TagBarSharedProps } from '../Bar/shared';
import { TagInputProps } from '../Input/shared';
import { buildMaxPropsName } from './shared';
import { useLayoutFormContainer } from '../../hooks/useLayoutFormContainer';
import { useLayoutFormLabel } from '../../hooks/useLayoutFormData';

type TagProps = TagBarSharedProps & TagInputProps;
export const TagCurrMaxDetail: TagComponent<TagProps> = TMemo((props) => {
  const current = props.name;
  const max = buildMaxPropsName(props.name);

  const FormContainer = useLayoutFormContainer(props);
  const label = useLayoutFormLabel(props);

  return (
    <FormContainer label={label}>
      <TagBarShared {...props} current={current} max={max} label={label} />
    </FormContainer>
  );
});
TagCurrMaxDetail.displayName = 'TagCurrMaxDetail';
