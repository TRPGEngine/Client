import React, { useCallback } from 'react';
import { TagComponent } from '../type';
import { LayoutCol } from '../Col/shared';
import { TagInputProps, TagLabel } from './shared';
import { useLayoutFormData } from '@shared/components/layout/hooks/useLayoutFormData';
import { Input } from 'antd';
import { tryToNumber } from '../utils';
import { BaseTypeRow } from '../Base/shared';

export const TagInputEdit: TagComponent<TagInputProps> = React.memo((props) => {
  const { label, placeholder, stateValue, setStateValue } = useLayoutFormData(
    props
  );

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setStateValue(tryToNumber(value));
  }, []);

  return (
    <BaseTypeRow>
      <LayoutCol span={6}>
        <TagLabel label={label} desc={props.desc} />
      </LayoutCol>
      <LayoutCol span={18}>
        <Input
          placeholder={placeholder}
          value={stateValue}
          onChange={handleChange}
          disabled={props.disabled}
        />
      </LayoutCol>
    </BaseTypeRow>
  );
});
TagInputEdit.displayName = 'TagInputEdit';
