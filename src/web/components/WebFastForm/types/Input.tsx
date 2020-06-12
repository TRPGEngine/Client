import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { Input, Form } from 'antd';
import { FastFormFieldComponent } from '@shared/components/FastForm';

export const FastFormInput: FastFormFieldComponent = TMemo((props) => {
  const { name, label, value, onChange } = props;

  return (
    <Form.Item label={label}>
      <Input
        name={name}
        size="large"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </Form.Item>
  );
});
FastFormInput.displayName = 'FastFormInput';
