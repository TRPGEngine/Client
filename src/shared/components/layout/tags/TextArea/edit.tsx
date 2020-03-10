import React, { useCallback, useMemo } from 'react';
import { TagComponent } from '../type';
import { TagInputProps } from '../Input/shared';
import { useLayoutFormData } from '../../hooks/useLayoutFormData';
import { useLayoutFormContainer } from '../../hooks/useLayoutFormContainer';
import { TMemo } from '@shared/components/TMemo';
import { AutoSizeType } from 'antd/lib/input/ResizableTextArea';
import TextArea from 'antd/lib/input/TextArea';

interface TagProps extends TagInputProps {
  autosize: boolean | AutoSizeType;
  rows: number;
}
export const TagTextAreaEdit: TagComponent<TagProps> = TMemo((props) => {
  const { label, placeholder, stateValue, setStateValue } = useLayoutFormData(
    props
  );

  const autosize = useMemo(() => props.autosize, []); // autosize 只在最初获取一次。不会接受后续的动态变更
  const rows = props.rows;

  const FormContainer = useLayoutFormContainer(props);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const { value } = e.target;

      setStateValue(value);
    },
    []
  );

  return useMemo(
    () => (
      <FormContainer label={label}>
        <TextArea
          autoSize={autosize}
          rows={rows}
          placeholder={placeholder}
          value={stateValue}
          onChange={handleChange}
        />
      </FormContainer>
    ),
    [label, autosize, rows, placeholder, stateValue, handleChange]
  );
});
TagTextAreaEdit.displayName = 'TagTextAreaEdit';
