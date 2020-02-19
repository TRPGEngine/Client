import React, { useCallback } from 'react';
import { TagComponent } from '../type';
import TextArea, { AutoSizeType } from 'antd/lib/input/TextArea';
import { LayoutCol } from '../Col/shared';
import { TagInputProps, TagLabel } from '../Input/shared';
import { useLayoutFormData } from '../../hooks/useLayoutFormData';
import { BaseTypeRow } from '../Base/shared';
import { useLayoutFormContainer } from '../../hooks/useLayoutFormContainer';

interface TagProps extends TagInputProps {
  autosize: boolean | AutoSizeType;
}
export const TagTextAreaEdit: TagComponent<TagProps> = React.memo((props) => {
  const { label, placeholder, stateValue, setStateValue } = useLayoutFormData(
    props
  );

  const FormContainer = useLayoutFormContainer(props);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const { value } = e.target;

      setStateValue(value);
    },
    []
  );

  return (
    <FormContainer label={label}>
      <TextArea
        autosize={props.autosize}
        placeholder={placeholder}
        value={stateValue}
        onChange={handleChange}
      />
    </FormContainer>
  );
});
TagTextAreaEdit.displayName = 'TagTextAreaEdit';
