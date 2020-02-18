import React from 'react';
import { TagComponent } from '../type';
import { LayoutCol } from '../Col/shared';
import { DetailText, TagInputProps, TagLabel } from './shared';
import { useLayoutFormData } from '@shared/components/layout/hooks/useLayoutFormData';
import { BaseTypeRow } from '../Base/shared';

export const TagInputDetail: TagComponent<TagInputProps> = React.memo(
  (props) => {
    const { label, stateValue } = useLayoutFormData(props);

    return (
      <BaseTypeRow>
        <LayoutCol span={6}>
          <TagLabel label={label} desc={props.desc} />
        </LayoutCol>
        <LayoutCol span={18}>
          <DetailText>{stateValue}</DetailText>
        </LayoutCol>
      </BaseTypeRow>
    );
  }
);
TagInputDetail.displayName = 'TagInputDetail';
