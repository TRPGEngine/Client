import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { Row, Col } from 'antd';
import { Avatar } from '@web/components/Avatar';
import { useCurrentUserInfo } from '@redux/hooks/user';
import { getUserName } from '@shared/utils/data-helper';
import { FullModalField } from '@web/components/FullModalField';
import { getFullDate } from '@shared/utils/date-helper';
import ImageUploader from '@web/components/ImageUploader';
import { useTRPGDispatch } from '@shared/hooks/useTRPGSelector';
import { updateInfo } from '@redux/actions/user';

export const SettingAccountView: React.FC = TMemo(() => {
  const userInfo = useCurrentUserInfo();
  const userName = getUserName(userInfo);
  const dispatch = useTRPGDispatch();

  const handleUpdateAvatar = (imageInfo: any) => {
    dispatch(updateInfo({ avatar: imageInfo.url }));
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
          <FullModalField title="昵称" value={userInfo.nickname} />
          <FullModalField title="性别" value={userInfo.sex} />
          <FullModalField title="简介" value={userInfo.sign} />
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
