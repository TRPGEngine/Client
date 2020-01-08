import React from 'react';
import { Formik, FormikActions } from 'formik';
import { Modal, Input, Form } from 'antd';

interface FeedbackModalProps {
  visible: boolean;
  onSubmit?: (
    values: FeedbackValues,
    formikActions: FormikActions<FeedbackValues>
  ) => void;
  onCancel?: () => void;
}
export interface FeedbackValues {
  username: string;
  contact: string;
  content: string;
}
export const FeedbackModal: React.FC<FeedbackModalProps> = React.memo(
  (props) => {
    return (
      <Formik<FeedbackValues>
        initialValues={{ username: '', contact: '', content: '' }}
        onSubmit={props.onSubmit}
      >
        {({ values, handleChange, handleSubmit, isSubmitting }) => (
          <Modal
            title="提交反馈"
            visible={props.visible}
            maskClosable={true}
            onOk={() => handleSubmit()}
            onCancel={props.onCancel}
            okButtonProps={{
              loading: isSubmitting,
            }}
          >
            <Form>
              <Form.Item label="用户名">
                <Input
                  name="username"
                  size="large"
                  placeholder="必填，TRPG用户名"
                  value={values.username}
                  onChange={handleChange}
                />
              </Form.Item>
              <Form.Item label="联系方式">
                <Input
                  name="contact"
                  size="large"
                  placeholder="可选，qq、微信、电话号均可"
                  value={values.contact}
                  onChange={handleChange}
                />
              </Form.Item>
              <Form.Item label="反馈内容">
                <Input.TextArea
                  name="content"
                  placeholder="必填，提交反馈的内容，越详细越好"
                  rows={4}
                  value={values.content}
                  onChange={handleChange}
                />
              </Form.Item>
            </Form>
          </Modal>
        )}
      </Formik>
    );
  }
);
