import React from 'react';
import { connect } from 'react-redux';
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
import config from '../../shared/project.config';
import './App.scss';
import '../assets/css/iconfont.css';
import 'react-select/dist/react-select.css';
import 'react-image-lightbox/style.css';

const ActorEditor = TLoadable(() => import('./actor/editor/ActorEditor'));
const Main = TLoadable(() => import('./Main'));
const Emoji = TLoadable(() => import('./Emoji'));

const Router: any =
  config.platform === 'web' || config.environment === 'development'
    ? BrowserRouter
    : HashRouter;
const appVersion = config.version;
import Login from './Login';
import Register from './Register';
import GlobalUI from './GlobalUI';

class App extends React.Component {
  render() {
    return (
      <Router>
        <ErrorBoundary>
          <GlobalUI />
          <div className="app">
            <Switch>
              <Route name="login" path="/login" component={Login} />
              <Route name="register" path="/register" component={Register} />
              <Route name="main" path="/main" component={Main} />
              <Route
                name="actor-editor"
                path="/actor-editor"
                component={ActorEditor}
              />
              <Route name="emoji" path="/emoji" component={Emoji} />
              <Route name="index" path="/">
                <Link to="login" className="start-btn">
                  <div className="main">点击屏幕登录</div>
                  <div className="sub">Press screen to login</div>
                </Link>
              </Route>
            </Switch>
            {config.platform === 'web' ? <NetworkIndicator /> : null}
            <div className="version">当前版本号v{appVersion}</div>
          </div>
        </ErrorBoundary>
      </Router>
    );
  }
}

export default connect()(App);
