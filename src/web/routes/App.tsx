import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import { Route, Switch, HashRouter, BrowserRouter } from 'react-router-dom';
import config from '@shared/project.config';
import { TMemo } from '@shared/components/TMemo';
import ErrorBoundary from '@web/containers/ErrorBoundary';
import { GlobalUI } from '@web/containers/GlobalUI';
import { EntryRoute } from './Entry';
import { LaunchRoute } from './Launch';
import { MainRoute } from './Main';
import { GlobalStyle } from './style';
import { LoginCheck } from './LoginCheck';
import { PortalProvider } from '@web/components/portal/PortalProvider';
import { PortalHost } from '@web/utils/portal';
import { NetworkStatusModal } from '@web/components/NetworkStatusModal';
import { DarkMode } from './DarkMode';
import { PWAContextProvider } from '@web/components/PWAContext';
import { wrapSentry } from '@web/utils/sentry';
import { RTCRoomClientContextProvider } from '@rtc/RoomContext';
import { GlobalVoiceProvider } from '@web/components/rtc/GlobalVoice';
import { trackUrlChangeEvent } from '@web/utils/analytics-helper';

import './App.less';

// 新版Web页面

const Router: any =
  config.platform === 'web' || config.environment === 'development'
    ? BrowserRouter
    : HashRouter;

const CustomProvider: React.FC = (props) => {
  const history = useHistory();

  useEffect(() => {
    const unlisten = history.listen((location, action) => {
      trackUrlChangeEvent();
    });

    return () => {
      unlisten();
    };
  }, []);

  return (
    <PWAContextProvider>
      <RTCRoomClientContextProvider>
        <GlobalVoiceProvider>
          <PortalProvider>
            <PortalHost>{props.children}</PortalHost>
          </PortalProvider>
        </GlobalVoiceProvider>
      </RTCRoomClientContextProvider>
    </PWAContextProvider>
  );
};

const _App = TMemo(() => {
  return (
    <Router>
      <ErrorBoundary>
        <DarkMode />
        <GlobalStyle />
        <GlobalUI />
        <div className="app new-ui-dark">
          <CustomProvider>
            <Switch>
              <Route name="entry" path="/entry" component={EntryRoute} />
              <Route name="main" path="/main" component={MainRoute} />
              <Route name="index" path="/" component={LaunchRoute} />
            </Switch>
            {config.platform === 'web' && <NetworkStatusModal />}
            {/* 新版本先注释掉, 等新版app做好了再放出来 */}
            {/* <AppBanner /> */}
            <LoginCheck />
          </CustomProvider>
        </div>
      </ErrorBoundary>
    </Router>
  );
});
_App.displayName = 'App';

export const App =
  config.environment === 'development' ? _App : wrapSentry(_App);
