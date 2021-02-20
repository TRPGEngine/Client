import Loading from '@portal/components/Loading';
import { checkToken, getPortalJWTInfo } from '@portal/utils/auth';
import { TMemo } from '@shared/components/TMemo';
import config from '@shared/project.config';
import { openPostWindow } from '@web/utils/dom-helper';
import React from 'react';
import { useAsync } from 'react-use';
import _isNil from 'lodash/isNil';
import { trackEvent } from '@web/utils/analytics-helper';

// 兔小巢反馈跳转

const TXCFeedback: React.FC = TMemo(() => {
  const { loading } = useAsync(async () => {
    const isLogin = await checkToken();

    if (isLogin === true) {
      // 跳转到兔小巢
      const userInfo = getPortalJWTInfo();
      if (
        _isNil(config.url.txcUrl) ||
        _isNil(userInfo.uuid) ||
        _isNil(userInfo.name)
      ) {
        return;
      }

      trackEvent('portal:txc');
      openPostWindow({
        url: config.url.txcUrl,
        data: {
          openid: userInfo.uuid,
          nickname: userInfo.name,
          avatar: userInfo.avatar ?? '',
        },
        target: '_self',
      });
    }
  });

  if (loading) {
    return <Loading />;
  }

  return <div>正在跳转中...</div>;
});
TXCFeedback.displayName = 'TXCFeedback';

export default TXCFeedback;
