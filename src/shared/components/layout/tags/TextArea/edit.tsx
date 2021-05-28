import React, { useCallback, useMemo } from 'react';
import type { TagComponent } from '../type';
import type { TagInputProps } from '../Input/shared';
import { useLayoutFormData } from '../../hooks/useLayoutFormData';
import { useLayoutFormContainer } from '../../hooks/useLayoutFormContainer';
import { TMemo } from '@shared/components/TMemo';
import { Input } from 'antd';
import type { AutoSizeType } from 'rc-textarea';
import { useToNumber } from '@shared/hooks/useToNumber';
import { useToBoolean } from '@shared/hooks/useToBoolean';
const TextArea = Input.TextArea;

interface TagProps extends TagInputProps {
  autosize?: boolean | AutoSizeType;
  rows?: number;
}
export const TagTextAreaEdit: TagComponent<TagProps> = TMemo((props) => {
  const { label, placeholder, stateValue, setStateValue } = useLayoutFormData(
    props
  );

  const autosize = useToBoolean(useMemo(() => props.autosize, [])); // autosize 只在最初获取一次。不会接受后续的动态变更
  const rows = useToNumber(props.rows) ?? undefined;

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
