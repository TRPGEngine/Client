import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { Select, Form } from 'antd';
import { FastFormFieldComponent } from '@shared/components/FastForm';

const Option = Select.Option;

interface FastFormSelectOptionsItem {
  label: string;
  value: string;
}

export const FastFormSelect: FastFormFieldComponent<{
  options: FastFormSelectOptionsItem[];
}> = TMemo((props) => {
  const { name, label, value, onChange, options } = props;

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
