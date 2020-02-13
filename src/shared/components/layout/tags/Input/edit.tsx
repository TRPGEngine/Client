import React, { useCallback } from 'react';
import { TagComponent } from '../type';
import { BaseTypeRow } from '../Base';
import { LayoutCol } from '../Col/shared';
import { Label } from './shared';
import { useLayoutFormData } from '@shared/components/layout/hooks/useLayoutFormData';
import { Input } from 'antd';
import { tryToNumber } from '../utils';

export const TagInputEdit: TagComponent = React.memo((props) => {
  const { label, placeholder, stateValue, setStateValue } = useLayoutFormData(
    props
  );

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setStateValue(tryToNumber(value));
  }, []);

  return (
    <BaseTypeRow key={props.key}>
      <LayoutCol span={6}>
        <Label title={label} />
      </LayoutCol>
      <LayoutCol span={18}>
        <Input
          placeholder={placeholder}
          value={stateValue}
          onChange={handleChange}
        />
      </LayoutCol>
    </BaseTypeRow>
  );
});
TagInputEdit.displayName = 'TagInputEdit';
