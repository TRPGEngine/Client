import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { Input, Form } from 'antd';
import type { FastFormFieldComponent } from '@shared/components/FastForm/field';

export const FastFormPassword: FastFormFieldComponent = TMemo((props) => {
  const { name, label, value, onChange } = props;

  return (
    <Form.Item label={label}>
      <Input
        name={name}
        type="password"
        size="large"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </Form.Item>
  );
});
FastFormPassword.displayName = 'FastFormPassword';
