import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { Input, Form } from 'antd';
import type { FastFormFieldComponent } from '@shared/components/FastForm/field';
import { getValidateStatus } from '../utils';

export const FastFormPassword: FastFormFieldComponent = TMemo((props) => {
  const { name, label, value, onChange, error, maxLength, placeholder } = props;

  return (
    <Form.Item
      label={label}
      validateStatus={getValidateStatus(error)}
      help={error}
    >
      <Input.Password
        name={name}
        type="password"
        size="large"
        maxLength={maxLength}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </Form.Item>
  );
});
FastFormPassword.displayName = 'FastFormPassword';
