import React, { useCallback } from 'react';
import { TMemo } from '@shared/components/TMemo';
import styled from 'styled-components';
import { Button } from 'antd';
import { getPortalUrl } from '@shared/utils/string-helper';
import { useRNStorage } from '@shared/hooks/useRNStorage';

const Container = styled.div`
  @media (min-width: 992px) {
    display: none;
  }

  position: fixed;
  bottom: 0px;
  left: 0px;
  width: 100%;
  padding: 6px 10px;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 999;
  color: white;
  display: flex;
  align-items: center;

  .close > .iconfont {
    cursor: pointer;
    font-size: 24px;
  }

  .logo {
    margin: 8px;
    border-radius: ${(props) => props.theme.radius.standard};
    overflow: hidden;

    > img {
      width: 40px;
      height: 40px;
    }
  }

  .title {
    flex: 1;
    display: flex;
    flex-direction: column;

    > .slogon {
      color: ${(props) => props.theme.color.gray};
      font-size: 14px;
    }
  }
`;
export const AppBanner: React.FC = TMemo(() => {
  const [appBannerClose, setAppBannerClose] = useRNStorage(
    'appBannerClose',
    false
  );

  const handleClose = useCallback(() => {
    setAppBannerClose(true);
  }, []);

  const handleJumpToDeploy = useCallback(() => {
    window.location.href = getPortalUrl('/deploy');
  }, []);

  if (appBannerClose === true) {
    return null;
  }

  return (
    <Container>
      <div className="close" onClick={handleClose}>
        <i className="iconfont">&#xe70c;</i>
      </div>
      <div className="logo">
        <img src="/src/web/assets/img/logo@192.png" alt="TRPG Engine" />
      </div>
      <div className="title">
        <div className="name">TRPG Engine</div>
        <div className="slogon">专为跑团而生</div>
      </div>
      <div className="download">
        <Button type="primary" onClick={handleJumpToDeploy}>
          下载移动版
        </Button>
      </div>
    </Container>
  );
});
AppBanner.displayName = 'AppBanner';
