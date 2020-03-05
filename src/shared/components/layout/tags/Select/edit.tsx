import React, { useMemo, useCallback } from 'react';
import { TagComponent } from '../type';
import { useLayoutFormData } from '@shared/components/layout/hooks/useLayoutFormData';
import { Select } from 'antd';
import { is } from '@shared/utils/string-helper';
import { useLayoutFormContainer } from '../../hooks/useLayoutFormContainer';
const Option = Select.Option;
const OptGroup = Select.OptGroup;
import { TMemo } from '@shared/components/TMemo';
import _isNil from 'lodash/isNil';
import _isString from 'lodash/isString';
import _flatten from 'lodash/flatten';
import { WarningFlag } from './WarningFlag';

interface TagProps {
  name: string;
  options: string | Array<string | { name: string; items: string[] }>;
  desc?: string;
  showSearch?: boolean | string;
  default?: string;
  strict?: boolean; // 是否开启严格模式, 如果开启严格模式则当值在数据中心不存在时, 显示一个警告
}
export const TagSelectEdit: TagComponent<TagProps> = TMemo((props) => {
  const { label, stateValue, setStateValue } = useLayoutFormData(props);

  const options = useMemo(() => {
    if (typeof props.options === 'string') {
      return props.options.split(',');
    }

    if (!Array.isArray(props.options)) {
      return [];
    }

    return props.options;
  }, [props.options]);

  const opt = useMemo(() => {
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
            <OptGroup key={item.name} label={item.name}>
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
  }, [options]);

  const showSearch = useMemo(() => {
    if (typeof props.showSearch === 'string') {
      return is(props.showSearch);
    } else {
      return props.showSearch;
    }
  }, [props.showSearch]);

  const strict = useMemo(() => {
    if (typeof props.strict === 'string') {
      return is(props.strict);
    } else {
      return props.strict;
    }
  }, [props.strict]);
  const strictWarning = useMemo(() => {
    if (_isNil(stateValue) || stateValue === '') {
      return false;
    }

    if (strict === true) {
      const items = _flatten(
        options.map((option) => {
          if (typeof option === 'string') {
            return [option];
          } else {
            return option.items ?? [];
          }
        })
      ); // 所有可用值

      return !items.includes(String(stateValue));
    }

    return false;
  }, [strict, stateValue]);

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
        {strictWarning && <WarningFlag />}
      </FormContainer>
    ),
    [label, showSearch, stateValue, handleChange, opt, strictWarning]
  );
});
TagSelectEdit.displayName = 'TagSelectEdit';
