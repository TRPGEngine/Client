import React from 'react';
import type { TagComponent } from '../type';
import { Input, Form } from 'antd';
import { LayoutCol } from '../Col/shared';
import { useLayoutFieldState } from '../../hooks/useLayoutFieldState';
import AvatarPicker from '@web/components/AvatarPicker';
import { TMemo } from '@shared/components/TMemo';
import { BaseInfoContainer, BaseInfoForm } from './shared';
const FormItem = Form.Item;
const TextArea = Input.TextArea;

export const TagBaseInfoEdit: TagComponent = TMemo((props) => {
  const [name, setName] = useLayoutFieldState('_name');
  const [desc, setDesc] = useLayoutFieldState('_desc');
  const [avatar, setAvatar] = useLayoutFieldState('_avatar');

  return (
    <BaseInfoContainer>
      <LayoutCol sm={18} xs={24}>
        <BaseInfoForm>
          <FormItem label="名称" required={true}>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </FormItem>
          <FormItem label="描述">
            <TextArea
              autoSize={{ maxRows: 8, minRows: 4 }}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </FormItem>
        </BaseInfoForm>
      </LayoutCol>
      <LayoutCol
        sm={6}
        xs={24}
        style={{ textAlign: 'center', marginBottom: 10 }}
      >
        <AvatarPicker
          imageUrl={String(avatar)}
          onChange={(imageUrl) => setAvatar(imageUrl)}
        />
      </LayoutCol>
    </BaseInfoContainer>
  );
});
TagBaseInfoEdit.displayName = 'TagBaseInfoEdit';
