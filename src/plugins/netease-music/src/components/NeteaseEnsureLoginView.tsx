import { TMemo } from '@capital/shared/components/TMemo';
import { fetchUserLoginStatus } from '../model/netease-music';
import React, { useEffect } from 'react';
import { useAsyncFn } from 'react-use';
import LoadingSpinner from '@capital/web/components/LoadingSpinner';
import { NeteaseMusicQRCodeLogin } from './NeteaseMusicQRCodeLogin';
import { Alert } from 'antd';
import { NeteaseUserinfoContext } from '../context/NeteaseUserinfoContext';
import { t } from '@capital/shared/i18n';
import { showToasts } from '@capital/shared/manager/ui';

/**
 * 用于确保登录状态
 * 如果当前处于登录状态, 则显示子内容
 * 否则显示登录二维码
 */
export const NeteaseEnsureLoginView: React.FC = TMemo((props) => {
  const [{ loading, value, error }, refresh] = useAsyncFn(async () => {
    try {
      const info = await fetchUserLoginStatus();

      return {
        account: info.account,
        profile: info.profile,
        isLogin: info.account !== null,
      };
    } catch (err) {
      showToasts(String(err), 'error');
    }
  }, []);

  useEffect(() => {
    refresh();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (value === undefined) {
    // 不应该到达的分支
    return <Alert message={t('出现异常')} />;
  }

  if (!value.isLogin) {
    return <NeteaseMusicQRCodeLogin onAuthorization={refresh} />;
  } else {
    return (
      <NeteaseUserinfoContext.Provider value={value}>
        {props.children}
      </NeteaseUserinfoContext.Provider>
    );
  }
});
NeteaseEnsureLoginView.displayName = 'NeteaseEnsureLoginView';
