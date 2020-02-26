import React, { useMemo, useCallback } from 'react';
import { TagComponent } from '../type';
import { useLayoutFormData } from '@shared/components/layout/hooks/useLayoutFormData';
import { Select } from 'antd';
import { is } from '@shared/utils/string-helper';
import { useLayoutFormContainer } from '../../hooks/useLayoutFormContainer';
const Option = Select.Option;
import { TMemo } from '@shared/components/TMemo';

interface TagProps {
  name: string;
  options: string | string[];
  desc?: string;
  showSearch?: boolean | string;
  default?: string;
}
export const TagSelectEdit: TagComponent<TagProps> = TMemo((props) => {
  const { label, stateValue, setStateValue } = useLayoutFormData(props);

  const opt: string[] = useMemo(() => {
    const options = props.options;
    if (typeof options === 'string') {
      return options.split(',');
    }

    return options;
  }, [props.options]);

  const showSearch = useMemo(() => {
    if (typeof props.showSearch === 'string') {
      return is(props.showSearch);
    } else {
      return props.showSearch;
    }
  }, [props.showSearch]);

  const FormContainer = useLayoutFormContainer(props);

  const handleChange = useCallback(
    (value) => {
      setStateValue(value);
    },
    [setStateValue]
  );

  return useMemo(
    () => (
      <FormContainer label={label}>
        <Select
          style={{ width: '100%' }}
          placeholder="请选择..."
          showSearch={showSearch}
          allowClear={true}
          value={stateValue}
          onChange={handleChange}
        >
          {(opt ?? []).map((item) => (
            <Option key={item} value={item}>
              {item}
            </Option>
          ))}
        </Select>
      </FormContainer>
    ),
    [label, showSearch, stateValue, handleChange, opt]
  );
});
TagSelectEdit.displayName = 'TagSelectEdit';
