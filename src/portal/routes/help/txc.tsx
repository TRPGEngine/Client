import Loading from '@portal/components/Loading';
import { checkToken } from '@portal/utils/auth';
import { TMemo } from '@shared/components/TMemo';
import config from '@shared/project.config';
import { getJWTUserInfo } from '@shared/utils/jwt-helper';
import { openPostWindow } from '@web/utils/dom-helper';
import React from 'react';
import { useAsync } from 'react-use';

// 兔小巢反馈跳转

const TXCFeedback: React.FC = TMemo(() => {
  const { loading } = useAsync(async () => {
    await checkToken();

    // 跳转到兔小巢
    const userInfo = await getJWTUserInfo();
    openPostWindow({
      url: config.url.txcUrl,
      data: {
        openid: userInfo.uuid,
        nickname: userInfo.name,
        avatar: userInfo.avatar,
      },
      target: '_self',
    });
  });

  if (loading) {
    return <Loading />;
  }

  return <div>正在跳转中...</div>;
});
TXCFeedback.displayName = 'TXCFeedback';

export default TXCFeedback;
