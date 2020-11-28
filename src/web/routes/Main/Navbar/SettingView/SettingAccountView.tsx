import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { Row, Col, Select } from 'antd';
import { Avatar } from '@web/components/Avatar';
import { useCurrentUserInfo } from '@redux/hooks/user';
import { getUserName } from '@shared/utils/data-helper';
import {
  FullModalField,
  DefaultFullModalInputEditorRender,
  DefaultFullModalTextAreaEditorRender,
  FullModalFieldEditorRenderComponent,
} from '@web/components/FullModalField';
import { getFullDate } from '@shared/utils/date-helper';
import ImageUploader from '@web/components/ImageUploader';
import { useTRPGDispatch } from '@shared/hooks/useTRPGSelector';
import { updateInfo } from '@redux/actions/user';
import { AlignmentChoose } from '@web/components/AlignmentChoose';
import { useTranslation } from '@shared/i18n';
import { UserAlignment } from '@shared/model/player';

const GenderSelector: FullModalFieldEditorRenderComponent = TMemo(
  ({ value, onChange }) => {
    return (
      <Select style={{ width: 200 }} value={value} onChange={onChange}>
        <Select.Option value="男">男</Select.Option>
        <Select.Option value="女">女</Select.Option>
        <Select.Option value="其他">其他</Select.Option>
        <Select.Option value="保密">保密</Select.Option>
      </Select>
    );
  }
);
GenderSelector.displayName = 'GenderSelector';

export const SettingAccountView: React.FC = TMemo(() => {
  const userInfo = useCurrentUserInfo();
  const userName = getUserName(userInfo);
  const dispatch = useTRPGDispatch();
  const { t } = useTranslation();

  const handleUpdateAvatar = (imageInfo: any) => {
    dispatch(updateInfo({ avatar: imageInfo.url }));
  };

  const buildUpdateFieldFn = (field: string) => {
    return (val: string) => {
      dispatch(updateInfo({ [field]: val }));
    };
  };

  return (
    <div>
      <Row>
        <Col sm={6}>
          <ImageUploader
            width="128"
            height="128"
            type="user"
            attachUUID={userInfo.uuid}
            onUploadSuccess={handleUpdateAvatar}
            circle={true}
          >
            <Avatar src={userInfo.avatar} name={userName} size={128} />
          </ImageUploader>
        </Col>
        <Col sm={18}>
          <FullModalField title="用户名" value={userInfo.username} />
          <FullModalField
            title="昵称"
            value={userInfo.nickname}
            editable={true}
            renderEditor={DefaultFullModalInputEditorRender}
            onSave={buildUpdateFieldFn('nickname')}
          />
          <FullModalField
            title="性别"
            value={userInfo.sex}
            editable={true}
            renderEditor={GenderSelector}
            onSave={buildUpdateFieldFn('sex')}
          />
          <FullModalField
            title="阵营"
            value={userInfo.alignment}
            content={t(userInfo.alignment ?? '未选择')}
            editable={true}
            renderEditor={AlignmentChoose as any}
            onSave={buildUpdateFieldFn('alignment')}
          />
          <FullModalField
            title="简介"
            value={userInfo.sign}
            content={<pre>{userInfo.sign}</pre>}
            editable={true}
            renderEditor={DefaultFullModalTextAreaEditorRender}
            onSave={buildUpdateFieldFn('sign')}
          />
          <FullModalField
            title="最后登录"
            value={`${getFullDate(userInfo.last_login)}`}
          />
        </Col>
      </Row>
    </div>
  );
});
SettingAccountView.displayName = 'SettingAccountView';
