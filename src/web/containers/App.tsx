import React from 'react';
import TLoadable from '../components/TLoadable';
import {
  Route,
  Switch,
  HashRouter,
  BrowserRouter,
  Link,
} from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';
import NetworkIndicator from '../components/NetworkIndicator';
import config from '@shared/project.config';
import './App.scss';
import 'react-image-lightbox/style.css';
import Login from './Login';
import Register from './Register';
import { GlobalUI } from './GlobalUI';
import { AppBanner } from '@web/components/AppBanner';
import { TMemo } from '@shared/components/TMemo';

const Main = TLoadable(() => import('./Main'));

const Router: any =
  config.platform === 'web' || config.environment === 'development'
    ? BrowserRouter
    : HashRouter;
const appVersion = config.version;

export const App: React.FC = TMemo(() => {
  return (
    <Router>
      <ErrorBoundary>
        <GlobalUI />
        <div className="app">
          <Switch>
            <Route name="login" path="/login" exact={true} component={Login} />
            <Route
              name="register"
              path="/register"
              exact={true}
              component={Register}
            />
            <Route name="main" path="/main" exact={true} component={Main} />
            <Route name="index" path="/">
              <Link to="/login" className="start-btn">
                <div className="main">点击屏幕登录</div>
                <div className="sub">Press screen to login</div>
              </Link>
            </Route>
          </Switch>
          {config.platform === 'web' ? <NetworkIndicator /> : null}
          <div className="version">当前版本号v{appVersion}</div>
          {/* <AppBanner /> */}
        </div>
      </ErrorBoundary>
    </Router>
  );
});
App.displayName = 'App';
