import React, { Fragment, useCallback, useState } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { Button, Modal, Form, Input, Col, Typography, Select, Row } from 'antd';
import { LoginEnsureContainer } from '@portal/components/LoginView/LoginEnsureContainer';
import { useFormik } from 'formik';
import TRPGEditor from '@shared/editor';
import _isFunction from 'lodash/isFunction';
import _toPairs from 'lodash/toPairs';
import {
  recruitPlatformMap,
  recruitContactTypeMap,
  createRecruit,
  RecruitPlatform,
  RecruitContactType,
} from '@portal/model/trpg';
import { handleError } from '@web/utils/error';

const RecruitCreateInitialValues = {
  title: '',
  content: '',
  platform: 'qq' as RecruitPlatform,
  contactType: 'user' as RecruitContactType,
  contactContent: '',
};

interface Props {
  onSuccess?: () => void;
}
export const RecruitCreateBtn: React.FC<Props> = TMemo((props) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { values, handleChange, handleSubmit, setFieldValue } = useFormik({
    initialValues: RecruitCreateInitialValues,
    onSubmit: () => {},
  });

  const handleCreateRecruit = useCallback(() => {
    setLoading(true);

    createRecruit(
      values.title,
      values.content,
      values.platform,
      values.contactType,
      values.contactContent
    )
      .then(() => {
        setShowModal(false);
        _isFunction(props.onSuccess) && props.onSuccess();
      })
      .catch(handleError)
      .finally(() => {
        setLoading(false);
      });
  }, [setLoading, setShowModal, values, props.onSuccess]);

  return (
    <Fragment>
      <Button type="primary" ghost={true} onClick={() => setShowModal(true)}>
        发布招募
      </Button>

      <Modal
        visible={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
      >
        <LoginEnsureContainer>
          <Form
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            onFinish={() => handleSubmit()}
          >
            <Col sm={24} md={{ span: 18, offset: 6 }}>
              <Typography.Title level={3} style={{ marginBottom: 16 }}>
                创建招募
              </Typography.Title>
            </Col>

            <Form.Item label="标题" required={true}>
              <Input
                name="title"
                placeholder="请输入标题"
                value={values.title}
                onChange={handleChange}
              />
            </Form.Item>
            <Form.Item label="内容" required={true}>
              <TRPGEditor
                style={{ height: 360 }}
                value={values.content}
                onChange={(c) => setFieldValue('content', c)}
              />
            </Form.Item>
            <Form.Item label="平台">
              <Select
                value={values.platform}
                onChange={(val) => setFieldValue('platform', val)}
              >
                {_toPairs(recruitPlatformMap).map(([value, text]) => (
                  <Select.Option key={value} value={value}>
                    {text}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="联系方式">
              <Row>
                <Select
                  style={{ width: 'auto' }}
                  value={values.contactType}
                  onChange={(val) => setFieldValue('contactType', val)}
                >
                  {_toPairs(recruitContactTypeMap).map(([value, text]) => (
                    <Select.Option key={value} value={value}>
                      {text}
                    </Select.Option>
                  ))}
                </Select>
                <Input
                  style={{ flex: 1 }}
                  name="contactContent"
                  value={values.contactContent}
                  placeholder="这是用户联系到你的唯一方式"
                  onChange={handleChange}
                />
              </Row>
            </Form.Item>
            <Form.Item wrapperCol={{ sm: 24, md: { span: 18, offset: 6 } }}>
              <Button
                type="primary"
                size="large"
                loading={loading}
                htmlType="button"
                style={{ width: '100%' }}
                onClick={() => handleCreateRecruit()}
              >
                发起招募
              </Button>
            </Form.Item>
          </Form>
        </LoginEnsureContainer>
      </Modal>
    </Fragment>
  );
});
RecruitCreateBtn.displayName = 'RecruitCreateBtn';
