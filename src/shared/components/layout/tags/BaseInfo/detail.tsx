import React from 'react';
import { TagComponent } from '../type';
import { Form } from '@ant-design/compatible';
import { UserOutlined } from '@ant-design/icons';
import '@ant-design/compatible/assets/index.css';
import { LayoutCol } from '../Col/shared';
import { useLayoutFieldState } from '../../hooks/useLayoutFieldState';
import Avatar from '@web/components/Avatar';
import { TMemo } from '@shared/components/TMemo';
import { BaseInfoContainer, BaseInfoForm } from './shared';
import _isNil from 'lodash/isNil';
const FormItem = Form.Item;

export const TagBaseInfoDetail: TagComponent = TMemo((props) => {
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
        <Avatar
          size={64}
          icon={<UserOutlined />}
          src={!_isNil(avatar) ? String(avatar) : undefined}
        />
      </LayoutCol>
    </BaseInfoContainer>
  );
});
TagBaseInfoDetail.displayName = 'TagBaseInfoDetail';
