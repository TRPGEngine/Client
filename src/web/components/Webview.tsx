import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import config from '@shared/project.config';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import './Webview.less';
import { Button, Result, Space } from 'antd';
import { t } from '@shared/i18n';
import {
  PopupViewer,
  PopupViewerRef,
  usePopupViewerManager,
} from './PopupViewer';
import _invoke from 'lodash/invoke';
import { TMemo } from '@shared/components/TMemo';
import styled from 'styled-components';
import { Iconfont } from './Iconfont';

let webframeIndex = 0;
const isElectron = config.platform === 'electron';

const WebviewContainer = styled.div`
  height: 100%;
  position: relative;
`;

const WebviewRenderContainer = styled.div`
  height: 100%;
  position: relative;

  iframe,
  webview {
    border: 0;
    width: 100%;
    height: 100%;
    display: flex;
  }
`;

const WebviewActions = styled(Space)`
  display: flex;
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1;
`;

function WebviewError(props: { message?: string }) {
  return (
    <Result
      status="warning"
      title={t('页面无法正常打开')}
      subTitle={props.message}
    />
  );
}

interface WebviewRenderProps {
  url: string;
  onError: () => void;
}
const WebviewRender: React.FC<WebviewRenderProps> = TMemo((props) => {
  const webId = useMemo(() => {
    webframeIndex++;
    return 'webframe' + webframeIndex;
  }, []);
  const webframeRef = useRef<any>(null);
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    NProgress.configure({ parent: '#' + webId });
    NProgress.start();
    const webframe = webframeRef.current!;
    if (isElectron) {
      webframe.src = props.url;
      webframe.addEventListener('dom-ready', function () {
        console.log('webview loadCompleted');
        if (NProgress.isRendered()) {
          NProgress.done();
        }
      });
      webframe.addEventListener('will-navigate', function (e: any) {
        console.log('webview change, url:', e.url);
        NProgress.start();
      });
    } else {
      webframe.src = props.url;
      webframe.onload = function (e) {
        console.log('webview loadCompleted');
        if (NProgress.isRendered()) {
          NProgress.done();
        }
      };
    }

    return () => {
      if (NProgress.isRendered()) {
        NProgress.done();
        NProgress.remove();
      }
    };
  }, [webId, props.url]);

  const handleError = useCallback(
    (e: React.SyntheticEvent<HTMLIFrameElement, Event>) => {
      if (NProgress.isRendered()) {
        NProgress.done();
      }
      setIsError(true);
      if (typeof props.onError === 'function') {
        props.onError();
      }
      setErrorMsg(`${t('页面加载失败')}: ${props.url}`);
    },
    [props.url, props.onError]
  );

  let inner: React.ReactNode = null;
  if (isError === true) {
    inner = <WebviewError message={errorMsg} />;
  } else {
    inner = isElectron ? (
      <webview ref={webframeRef} />
    ) : (
      <iframe ref={webframeRef} onError={handleError}>
        <p>{t('请使用现代浏览器打开本页面')}</p>
      </iframe>
    );
  }

  return <WebviewRenderContainer id={webId}>{inner}</WebviewRenderContainer>;
});
WebviewRender.displayName = 'WebviewRender';

interface WebviewProps {
  src: string;
  allowExopen?: boolean;
  allowPopup?: boolean;
}
export const Webview: React.FC<WebviewProps> = TMemo((props) => {
  const popupViewRef = useRef<PopupViewerRef>(null);
  const [isError, setIsError] = useState(false);
  const viewId = useMemo(() => `web-${props.src}`, [props.src]);
  const { hasPopupViewId } = usePopupViewerManager();

  const handleOpenInNewWindow = useCallback(() => {
    window.open(props.src, 'square', 'frame=true');
  }, [props.src]);

  const handlePopupWindow = useCallback(() => {
    _invoke(popupViewRef.current, 'popup');
  }, []);

  const disableActions = useMemo(
    () => isError || hasPopupViewId(viewId),
    [isError, hasPopupViewId, viewId]
  );

  const actions = disableActions ? null : (
    <WebviewActions>
      {props.allowPopup && (
        <Button
          title={t('弹出')}
          icon={<Iconfont>&#xe768;</Iconfont>}
          onClick={handlePopupWindow}
        />
      )}

      {props.allowExopen && (
        <Button
          title={t('在新窗口打开')}
          icon={<Iconfont>&#xe63c;</Iconfont>}
          onClick={handleOpenInNewWindow}
        />
      )}
    </WebviewActions>
  );
  return (
    <WebviewContainer>
      {actions}

      <PopupViewer
        viewId={viewId}
        containerStyle={{ height: '100%' }}
        ref={popupViewRef}
      >
        <WebviewRender url={props.src} onError={() => setIsError(true)} />
      </PopupViewer>
    </WebviewContainer>
  );
});
Webview.displayName = 'Webview';
Webview.defaultProps = {
  allowExopen: false,
  allowPopup: false,
};

export default Webview;
