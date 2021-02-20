import React, { useMemo } from 'react';
import { FastForm } from '@shared/components/FastForm';
import { regField } from '@shared/components/FastForm/field';
import {
  FastFormContainerComponent,
  regFormContainer,
} from '@shared/components/FastForm/container';
import { TMemo } from '@shared/components/TMemo';
import { Form, Button } from 'antd';

import { FastFormText } from './types/Text';
import { FastFormTextArea } from './types/TextArea';
import { FastFormPassword } from './types/Password';
import { FastFormSelect } from './types/Select';
import { FastFormCustom } from './types/Custom';

regField('text', FastFormText);
regField('textarea', FastFormTextArea);
regField('password', FastFormPassword);
regField('select', FastFormSelect);
regField('custom', FastFormCustom);

const WebFastFormContainer: FastFormContainerComponent = TMemo((props) => {
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
          disabled={props.canSubmit === false}
        >
          {props.submitLabel ?? '提交'}
        </Button>
      </Form.Item>
    );
  }, [props.loading, props.handleSubmit, props.canSubmit, props.submitLabel]);

  return (
    <Form labelCol={{ sm: 24, md: 8 }} wrapperCol={{ sm: 24, md: 16 }}>
      {props.children}
      {submitButtonRender}
    </Form>
  );
});
WebFastFormContainer.displayName = 'WebFastFormContainer';
regFormContainer(WebFastFormContainer);

export const WebFastForm = FastForm;
WebFastForm.displayName = 'WebFastForm';
