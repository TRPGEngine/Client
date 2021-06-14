import { TMemo } from '@capital/shared/components/TMemo';
import { t } from '@capital/shared/i18n';
import { Button, Col, Divider, Row } from 'antd';
import { NeteaseUserinfoContext } from '../context/NeteaseUserinfoContext';
import React, { useContext, useReducer } from 'react';
import { NeteaseEnsureLoginView } from './NeteaseEnsureLoginView';
import { logout } from '../model/netease-music';
import { showToasts } from '@capital/shared/manager/ui';
import { Avatar } from '@capital/web/components/Avatar';
import { FullModalField } from '@capital/web/components/FullModalField';
import { useAsyncFn } from 'react-use';

const NeteaseMusicUserProfile = TMemo(() => {
  const { profile } = useContext(NeteaseUserinfoContext);

  if (profile === null) {
    return null;
  }

  return (
    <Row>
      <Col sm={6}>
        <Avatar
          style={{ marginRight: 10 }}
          size={128}
          src={profile.avatarUrl}
        />
      </Col>
      <Col sm={18}>
        <FullModalField title={t('网易云用户名')} value={profile.userName} />
        <FullModalField title={t('网易云昵称')} value={profile.nickname} />
      </Col>
    </Row>
  );
});
NeteaseMusicUserProfile.displayName = 'NeteaseMusicUserProfile';

/**
 * 网易云音乐设置页
 */
export const NeteaseMusicSettingView: React.FC = TMemo(() => {
  const [key, forceUpdate] = useReducer((i) => ++i, 0);

  const [{ loading }, handleLogout] = useAsyncFn(async () => {
    try {
      await logout();
      showToasts(t('登出成功'), 'success');
      forceUpdate();
    } catch (err) {
      showToasts(t('失败'), 'error');
    }
  }, []);

  return (
    <div key={key}>
      <NeteaseEnsureLoginView>
        <NeteaseMusicUserProfile />
        <Divider />
        <Button danger={true} loading={loading} onClick={handleLogout}>
          {t('退出登录')}
        </Button>
      </NeteaseEnsureLoginView>
    </div>
  );
});
NeteaseMusicSettingView.displayName = 'NeteaseMusicSettingView';
