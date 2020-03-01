import React, { useMemo, useCallback } from 'react';
import { TagComponent } from '../type';
import { useLayoutFormData } from '@shared/components/layout/hooks/useLayoutFormData';
import { Select } from 'antd';
import { is } from '@shared/utils/string-helper';
import { useLayoutFormContainer } from '../../hooks/useLayoutFormContainer';
const Option = Select.Option;
const OptGroup = Select.OptGroup;
import { TMemo } from '@shared/components/TMemo';
import _isString from 'lodash/isString';

interface TagProps {
  name: string;
  options: string | Array<string | { name: string; items: string[] }>;
  desc?: string;
  showSearch?: boolean | string;
  default?: string;
}
export const TagSelectEdit: TagComponent<TagProps> = TMemo((props) => {
  const { label, stateValue, setStateValue } = useLayoutFormData(props);

  const opt = useMemo(() => {
    let options = props.options;

    if (typeof options === 'string') {
      options = options.split(',');
    }

    if (Array.isArray(options)) {
      return options.map((item) => {
        if (_isString(item)) {
          // 无分组
          return (
            <Option key={item} value={item}>
              {item}
            </Option>
          );
        } else {
          // 有分组
          return (
            <OptGroup label={item.name}>
              {(item.items || []).map((item) => (
                <Option key={item} value={item}>
                  {item}
                </Option>
              ))}
            </OptGroup>
          );
        }
      });
    }

    return null;
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
          {opt}
        </Select>
      </FormContainer>
    ),
    [label, showSearch, stateValue, handleChange, opt]
  );
});
TagSelectEdit.displayName = 'TagSelectEdit';
