import React, { useEffect } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { Select, Form } from 'antd';
import _get from 'lodash/get';
import _isNil from 'lodash/isNil';
import { FastFormFieldComponent } from '@shared/components/FastForm/field';

const Option = Select.Option;

interface FastFormSelectOptionsItem {
  label: string;
  value: string;
}

export const FastFormSelect: FastFormFieldComponent<{
  options: FastFormSelectOptionsItem[];
}> = TMemo((props) => {
  const { name, label, value, onChange, options } = props;

  useEffect(() => {
    if (_isNil(value) || value === '') {
      // 如果没有值的话则自动设置默认值
      onChange(_get(options, [0, 'value']));
    }
  }, []);

  return (
    <Form.Item label={label}>
      <Select size="large" value={value} onChange={(value) => onChange(value)}>
        {options.map((option, i) => (
          <Option key={`${option.value}${i}`} value={option.value}>
            {option.label}
          </Option>
        ))}
      </Select>
    </Form.Item>
  );
});
FastFormSelect.displayName = 'FastFormSelect';
