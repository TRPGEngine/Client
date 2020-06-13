import React, { useMemo } from 'react';
import {
  FastForm,
  regField,
  FastFormContainerComponent,
  regFormContainer,
} from '@shared/components/FastForm';
import { TMemo } from '@shared/components/TMemo';
import { Form, Button } from 'antd';

import { FastFormText } from './types/Text';
import { FastFormPassword } from './types/Password';

regField('text', FastFormText);
regField('password', FastFormPassword);

const FastFormContainer: FastFormContainerComponent = TMemo((props) => {
  const submitButtonRender = useMemo(() => {
    return (
      <Form.Item wrapperCol={{ sm: 24, md: { span: 16, offset: 8 } }}>
        <Button
          loading={props.loading}
          type="primary"
          size="large"
          htmlType="button"
          style={{ width: '100%' }}
          onClick={() => props.handleSubmit()}
        >
          {props.submitLabel ?? '提交'}
        </Button>
      </Form.Item>
    );
  }, [props.loading, props.handleSubmit, props.submitLabel]);

  return (
    <Form labelCol={{ sm: 24, md: 8 }} wrapperCol={{ sm: 24, md: 16 }}>
      {props.children}
      {submitButtonRender}
    </Form>
  );
});
FastFormContainer.displayName = 'FastFormContainer';
regFormContainer(FastFormContainer);

export const WebFastForm = FastForm;
WebFastForm.displayName = 'WebFastForm';
