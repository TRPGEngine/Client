import React from 'react';
import { ILayoutTypeAttributes, ILayoutType, LayoutTypeContext } from './Base';
import { Row, Col, Form, Input } from 'antd';
import { getStateValue, setStateValue } from './utils';
import TextArea from 'antd/lib/input/TextArea';
import Avatar from '@web/components/Avatar';
import AvatarPicker from '@web/components/AvatarPicker';
import styled from 'styled-components';
const FormItem = Form.Item;

const BaseInfoContainer = styled(Row).attrs({
  type: 'flex',
})`
  flex-wrap: wrap-reverse;
  margin-bottom: 10px;
  border-bottom: ${(props) => props.theme.border.standard};
  padding-top: 24px;
`;

const BaseInfoForm = styled(Form).attrs({
  layout: 'vertical',
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
})``;

interface Attr extends ILayoutTypeAttributes {}

/**
 * 基础信息
 * 所有模板必须的信息
 * 处理_name, _desc, _avatar这三个内置变量
 */
export default class BaseInfo implements ILayoutType<Attr> {
  name: string = 'BaseInfo';

  getEditView(ctx: LayoutTypeContext<Attr>) {
    const { context } = ctx;

    return (
      <BaseInfoContainer>
        <Col sm={18} xs={24}>
          <BaseInfoForm>
            <FormItem label="名称" required>
              <Input
                value={getStateValue(context, '_name')}
                onChange={(e) =>
                  setStateValue(context, '_name', e.target.value)
                }
              />
            </FormItem>
            <FormItem label="描述">
              <TextArea
                autosize={{ maxRows: 8, minRows: 4 }}
                value={getStateValue(context, '_desc')}
                onChange={(e) =>
                  setStateValue(context, '_desc', e.target.value)
                }
              />
            </FormItem>
          </BaseInfoForm>
        </Col>
        <Col sm={6} xs={24} style={{ textAlign: 'center', marginBottom: 10 }}>
          <AvatarPicker
            imageUrl={String(getStateValue(context, '_avatar'))}
            onChange={(imageUrl) => setStateValue(context, '_avatar', imageUrl)}
          />
        </Col>
      </BaseInfoContainer>
    );
  }

  getDetailView(ctx: LayoutTypeContext<Attr>) {
    const { context } = ctx;

    return (
      <BaseInfoContainer>
        <Col sm={18} xs={24}>
          <BaseInfoForm>
            <FormItem label="名称" required>
              <div>{getStateValue(context, '_name')}</div>
            </FormItem>
            <FormItem label="描述">
              <div>{getStateValue(context, '_desc')}</div>
            </FormItem>
          </BaseInfoForm>
        </Col>
        <Col sm={6} xs={24} style={{ textAlign: 'center', marginBottom: 10 }}>
          <Avatar
            size={64}
            icon="user"
            src={String(getStateValue(context, '_avatar'))}
          />
        </Col>
      </BaseInfoContainer>
    );
  }
}
