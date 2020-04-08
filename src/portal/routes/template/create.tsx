import React, { useEffect, useState } from 'react';
import _isNil from 'lodash/isNil';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Button, message } from 'antd';
import { checkToken } from '@portal/utils/auth';
import { useFormik } from 'formik';
import styled from 'styled-components';
import { createTemplate } from '@portal/model/template';

const Container = styled.div`
  padding: 20px 10px;
  max-width: 800px;
  margin: auto;
`;

interface TemplateFormValues {
  name: string;
  desc: string;
  layout: string;
}

const initialValues = {
  name: '',
  desc: '',
  layout: '',
};

const formItemLayout = {
  labelCol: { sm: 6 },
  wrapperCol: { sm: 18 },
};

const tailFormItemLayout = {
  wrapperCol: {
    sm: {
      span: 18,
      offset: 6,
    },
  },
};

const TemplateCreate: React.FC = React.memo(() => {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    checkToken();
  }, []);

  const { values, handleSubmit, handleChange } = useFormik<TemplateFormValues>({
    initialValues,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        await createTemplate(values.name, values.desc, values.layout);
        message.success('创建成功');
      } catch (e) {
        message.error('创建失败:' + String(e));
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Container>
      <Form layout="horizontal" {...formItemLayout} onSubmit={handleSubmit}>
        <Form.Item label="模板名">
          <Input
            name="name"
            size="large"
            value={values.name}
            onChange={handleChange}
          />
        </Form.Item>
        <Form.Item label="描述">
          <Input.TextArea
            name="desc"
            autoSize={{
              maxRows: 4,
              minRows: 2,
            }}
            value={values.desc}
            onChange={handleChange}
          />
        </Form.Item>
        <Form.Item label="布局">
          <Input.TextArea
            name="layout"
            autoSize={{
              maxRows: 10,
              minRows: 4,
            }}
            value={values.layout}
            onChange={handleChange}
          />
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button
            type="primary"
            size="large"
            loading={loading}
            htmlType="submit"
            style={{ width: '100%' }}
          >
            创建
          </Button>
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <p>名称和描述用于简单说明模板的用处</p>
          <p>
            布局设计可以先通过&nbsp;
            <a href="/playground/" target="_blank">
              Playground
            </a>
            &nbsp;进行测试, 然后将写的布局代码复制粘贴到上述文本框中
          </p>
        </Form.Item>
      </Form>
    </Container>
  );
});

export default TemplateCreate;
