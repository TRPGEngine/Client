import React, { useCallback, useMemo } from 'react';
import { useCachedUserInfo } from '@redux/hooks/useCache';
import styled from 'styled-components';
import Avatar from '../Avatar';
import _isEmpty from 'lodash/isEmpty';
import { TMemo } from '@shared/components/TMemo';
import { useTranslation } from '@shared/i18n';
import { openUserProfile } from '../modals/UserProfile';
import { useTPopoverContext } from './index';

const Container = styled.div`
  display: flex;
  min-width: 180px;
  max-width: 240px;

  .avatar {
    overflow: hidden;
    cursor: pointer;

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
  const { closePopover } = useTPopoverContext();
  const userInfo = useCachedUserInfo(props.userUUID);
  const { t } = useTranslation();

  const name = useMemo(() => userInfo.nickname ?? userInfo.username ?? '', [
    userInfo.nickname,
    userInfo.username,
  ]);

  const handleClickAvatar = useCallback(() => {
    openUserProfile(props.userUUID);
    closePopover();
  }, [closePopover, props.userUUID]);

  return (
    <Container>
      <div className="avatar" onClick={handleClickAvatar}>
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
