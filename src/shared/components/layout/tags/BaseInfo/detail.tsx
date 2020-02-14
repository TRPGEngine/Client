import React from 'react';
import { TagComponent } from '../type';
import styled from 'styled-components';
import { Row, Form, Input } from 'antd';
import { LayoutCol } from '../Col/shared';
import { useLayoutFieldState } from '../../hooks/useLayoutFieldState';
import Avatar from '@web/components/Avatar';
const FormItem = Form.Item;
const TextArea = Input.TextArea;

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

export const TagBaseInfoDetail: TagComponent = React.memo((props) => {
  const [name, setName] = useLayoutFieldState('_name');
  const [desc, setDesc] = useLayoutFieldState('_desc');
  const [avatar, setAvatar] = useLayoutFieldState('_avatar');

  return (
    <BaseInfoContainer key={props.key}>
      <LayoutCol sm={18} xs={24}>
        <BaseInfoForm>
          <FormItem label="名称" required>
            <div>{name}</div>
          </FormItem>
          <FormItem label="描述">
            <div>{desc}</div>
          </FormItem>
        </BaseInfoForm>
      </LayoutCol>
      <LayoutCol
        sm={6}
        xs={24}
        style={{ textAlign: 'center', marginBottom: 10 }}
      >
        <Avatar size={64} icon="user" src={String(avatar)} />
      </LayoutCol>
    </BaseInfoContainer>
  );
});
TagBaseInfoDetail.displayName = 'TagBaseInfoDetail';
