import React, { useMemo } from 'react';
import { useCachedUserInfo } from '@shared/hooks/useCache';
import styled from 'styled-components';
import Avatar from '../Avatar';
import config from '@shared/project.config';
import _isEmpty from 'lodash/isEmpty';
import { TMemo } from '@shared/components/TMemo';
import { useTranslation } from '@shared/i18n';

const Container = styled.div`
  display: flex;
  max-width: 240px;

  .avatar {
    overflow: hidden;

    > img {
      width: 100%;
      height: 100%;
    }
  }

  .info {
    flex: 1;
    margin-left: 10px;
    overflow: hidden;
  }
`;

interface Props {
  userUUID: string;
}
const PopoverUserInfo: React.FC<Props> = TMemo((props) => {
  const userInfo = useCachedUserInfo(props.userUUID);
  const { t } = useTranslation();

  const name = useMemo(() => userInfo.nickname ?? userInfo.username ?? '', [
    userInfo.nickname,
    userInfo.username,
  ]);

  return (
    <Container>
      <div className="avatar">
        <Avatar size="large" src={userInfo.avatar} name={name} />
      </div>
      <div className="info">
        <div>
          <span>{t('用户名')}: </span>
          <span>{name}</span>
        </div>
        <div>
          <span>{t('性别')}: </span>
          <span>{userInfo.sex}</span>
        </div>
        <div>
          <span>{t('签名')}: </span>
          <p>{userInfo.sign}</p>
        </div>
      </div>
    </Container>
  );
});
PopoverUserInfo.displayName = 'PopoverUserInfo';

export default PopoverUserInfo;
