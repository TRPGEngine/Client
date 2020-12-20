import React from 'react';
import { Route, Switch, HashRouter, BrowserRouter } from 'react-router-dom';
import config from '@shared/project.config';
import { TMemo } from '@shared/components/TMemo';
import ErrorBoundary from '@web/containers/ErrorBoundary';
import { GlobalUI } from '@web/containers/GlobalUI';
import { LaunchRoute } from './Launch';
// import Login from '../containers/Login';
import { Login } from './Login';
// import Register from '@web/containers/Register';
import { Register } from './Register';
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

import './App.less';

// 新版Web页面

const Router: any =
  config.platform === 'web' || config.environment === 'development'
    ? BrowserRouter
    : HashRouter;

const CustomProvider: React.FC = (props) => {
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
              <Route name="login" path="/login" component={Login} />
              <Route name="register" path="/register" component={Register} />
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
