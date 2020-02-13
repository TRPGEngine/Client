import React, { useCallback } from 'react';
import { TagComponent } from '../type';
import TextArea from 'antd/lib/input/TextArea';
import { LayoutCol } from '../Col/shared';
import { BaseTypeRow } from '../Base';
import { Label } from '../Input/shared';
import { useLayoutFormData } from '../../hooks/useLayoutFormData';

export const TagTextAreaEdit: TagComponent = React.memo((props) => {
  const { label, placeholder, stateValue, setStateValue } = useLayoutFormData(
    props
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const { value } = e.target;

      setStateValue(value);
    },
    []
  );

  return (
    <BaseTypeRow key={props.key}>
      <LayoutCol span={6}>
        <Label title={label}>{label}</Label>
      </LayoutCol>
      <LayoutCol span={18}>
        <TextArea
          autosize={props.autosize}
          placeholder={placeholder}
          value={stateValue}
          onChange={handleChange}
        />
      </LayoutCol>
    </BaseTypeRow>
  );
});
TagTextAreaEdit.displayName = 'TagTextAreaEdit';
