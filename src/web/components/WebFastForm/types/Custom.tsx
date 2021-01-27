import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { Form } from 'antd';
import _get from 'lodash/get';
import _isNil from 'lodash/isNil';
import type {
  FastFormFieldComponent,
  FastFormFieldProps,
} from '@shared/components/FastForm/field';
import { CustomField } from '@shared/components/FastForm/CustomField';

export const FastFormCustom: FastFormFieldComponent<{
  render: (props: FastFormFieldProps) => React.ReactNode;
}> = TMemo((props) => {
  const { label } = props;

  return (
    <Form.Item label={label}>
      <CustomField {...props} />
    </Form.Item>
  );
});
FastFormCustom.displayName = 'FastFormCustom';
