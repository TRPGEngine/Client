import React from 'react';
import { TagComponent } from '../type';
import styled from 'styled-components';
import { Row, Form, Input } from 'antd';
import { LayoutCol } from '../Col/shared';
import { useLayoutFieldState } from '../../hooks/useLayoutFieldState';
import Avatar from '@web/components/Avatar';
import { BaseInfoContainer, BaseInfoForm } from './shared';
const FormItem = Form.Item;
const TextArea = Input.TextArea;

export const TagBaseInfoDetail: TagComponent = React.memo((props) => {
  const [name, setName] = useLayoutFieldState('_name');
  const [desc, setDesc] = useLayoutFieldState('_desc');
  const [avatar, setAvatar] = useLayoutFieldState('_avatar');

  return (
    <BaseInfoContainer>
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
