import React from 'react';
import { TagComponent } from '../type';
import { BaseTypeRow } from '../Base';
import { LayoutCol } from '../Col/shared';
import { Label, DetailText } from './shared';
import { useLayoutFormData } from '@shared/components/layout/hooks/useLayoutFormData';

export const TagInputDetail: TagComponent = React.memo((props) => {
  const { label, stateValue } = useLayoutFormData(props);

  return (
    <BaseTypeRow key={props.key}>
      <LayoutCol span={6}>
        <Label title={label} />
      </LayoutCol>
      <LayoutCol span={18}>
        <DetailText>{stateValue}</DetailText>
      </LayoutCol>
    </BaseTypeRow>
  );
});
TagInputDetail.displayName = 'TagInputDetail';
