import { TMemo } from '@shared/components/TMemo';
import { useRNStorage } from '@shared/hooks/useRNStorage';
import { ANNOUNCEMENT_BAR_CLOSE } from '@shared/utils/consts';
import { switchToAppVersion } from '@web/utils/debug-helper';
import { Typography } from 'antd';
import React, { useCallback } from 'react';
import styled from 'styled-components';
import { Iconfont } from './Iconfont';
/**
 * 公告栏
 */

const Root = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  box-shadow: ${(props) => props.theme.boxShadow.normal};
  padding: 0 20px;
  background-color: white;
`;

const CloseBtn = styled(Iconfont)`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 10px;
`;

const Content = styled.div`
  text-align: center;
`;

const announcementId = 1; // 每次新的公告都应当+1
const announcementCloseKey = `${ANNOUNCEMENT_BAR_CLOSE}$${announcementId}`;
export const AnnouncementBar: React.FC = TMemo(() => {
  const [appBannerClose, setAppBannerClose] = useRNStorage(
    announcementCloseKey,
    false,
    true
  );
  const handleClose = useCallback(() => {
    setAppBannerClose(true);
  }, [setAppBannerClose]);

  if (appBannerClose === true) {
    return null;
  }

  return null; // 关闭公告

  return (
    <Root>
      <Content>
        新版UI已发布,{' '}
        <Typography.Link onClick={() => switchToAppVersion(true)}>
          立即体验
        </Typography.Link>
      </Content>
      <CloseBtn title="不再提示" onClick={handleClose}>
        &#xe70c;
      </CloseBtn>
    </Root>
  );
});
AnnouncementBar.displayName = 'AnnouncementBar';
