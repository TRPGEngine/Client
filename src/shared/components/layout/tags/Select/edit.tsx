import React, { useMemo, useCallback, useState, Fragment } from 'react';
import type { TagComponent } from '../type';
import { useLayoutFormData } from '@shared/components/layout/hooks/useLayoutFormData';
import { Select, Divider, Input, Button } from 'antd';
import { is } from '@shared/utils/string-helper';
import { useLayoutFormContainer } from '../../hooks/useLayoutFormContainer';
const Option = Select.Option;
const OptGroup = Select.OptGroup;
import { TMemo } from '@shared/components/TMemo';
import _isNil from 'lodash/isNil';
import _isString from 'lodash/isString';
import _flatten from 'lodash/flatten';
import { WarningFlag } from './WarningFlag';
import { useToBoolean } from '@shared/hooks/useToBoolean';

interface TagProps {
  name: string;
  options: string | (string | { name: string; items: string[] })[];
  placeholder?: string;
  desc?: string;
  showSearch?: boolean | string;
  default?: string;
  strict?: boolean; // 是否开启严格模式, 如果开启严格模式且当值在数据中不存在时, 显示一个警告
  allowCustom?: boolean; // 是否允许增加自定义
}
export const TagSelectEdit: TagComponent<TagProps> = TMemo((props) => {
  const { label, stateValue, setStateValue } = useLayoutFormData(props);
  const [customItems, setCustomItems] = useState<string[]>([]);
  const allowCustom = useToBoolean(props.allowCustom);
  const placeholder = props.placeholder ?? '请选择...'; // Select的placeholder是直接从props中获取的。如果没有则为请选择

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
      return [...options, ...customItems].map((item) => {
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
  }, [options, customItems]);

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

  const [customItemName, setCustomItemName] = useState('');
  const handleAddCustomItem = useCallback(() => {
    if (customItemName === '') {
      return;
    }
    setCustomItemName('');
    setCustomItems([...customItems, customItemName]);
  }, [customItemName, setCustomItemName, setCustomItems, customItems]);
  const dropdownRender = useCallback(
    (menu: React.ReactElement): React.ReactElement => {
      return (
        <div>
          {menu}
          {allowCustom === true && (
            <Fragment>
              <Divider style={{ margin: '4px 0' }} />
              <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                <Input
                  style={{ flex: 'auto' }}
                  value={customItemName}
                  onChange={(e) => setCustomItemName(e.target.value)}
                  size="small"
                />
                <Button
                  type="link"
                  block={true}
                  disabled={customItemName === ''}
                  onClick={handleAddCustomItem}
                >
                  <i className="iconfont">&#xe604;</i> 自定义
                </Button>
              </div>
            </Fragment>
          )}
        </div>
      );
    },
    [allowCustom, customItemName, setCustomItemName, handleAddCustomItem]
  );

  return useMemo(
    () => (
      <FormContainer label={label}>
        <Select
          style={{ width: '100%' }}
          placeholder={placeholder}
          showSearch={showSearch}
          allowClear={true}
          value={stateValue}
          onChange={handleChange}
          dropdownRender={dropdownRender}
        >
          {opt}
        </Select>
        {strictWarning && <WarningFlag />}
      </FormContainer>
    ),
    [
      label,
      showSearch,
      stateValue,
      handleChange,
      opt,
      strictWarning,
      dropdownRender,
    ]
  );
});
TagSelectEdit.displayName = 'TagSelectEdit';
