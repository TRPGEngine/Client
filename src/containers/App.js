import React from 'react';
import { connect } from 'react-redux';
const { Route, Redirect, Switch, HashRouter, BrowserRouter, Link } = require('react-router-dom');
const Modal = require('../components/Modal');
const Loading = require('../components/Loading');
const Alert = require('../components/Alert');
const NetworkIndicator = require('../components/NetworkIndicator');
const config = require('../../config/project.config.js');
require('./App.scss');
require('../assets/css/iconfont.css');

const Router = (config.platform === 'web' || config.environment === 'development') ? BrowserRouter : HashRouter;
const appVersion = config.version;
const Login = require('./Login');
const Register = require('./Register');
const Main = require('./Main');

class App extends React.Component {
  render() {
    const {showLoading, showLoadingText, showAlert, showAlertInfo} = this.props;
    let alertInfo = showAlertInfo.toJS();
    return (
      <Router>
        <div>
          <Modal />
          <Loading show={showLoading} text={showLoadingText} />
          <Alert
            show={showAlert}
            title={alertInfo.title || ''}
            content={alertInfo.content}
            type={alertInfo.type || 'alert'}
            onConfirm={alertInfo.onConfirm} />
          <div className="app">
            <Switch>
              <Route name="login" path="/login" component={Login} />
              <Route name="register" path="/register" component={Register} />
              <Route name="main" path="/main" component={Main} />
              <Route name="index" path="/">
                <Link to="login" className="start-btn">
                  <div className="main">点击屏幕登录</div>
                  <div className="sub">Press screen to login</div>
                </Link>
              </Route>
            </Switch>
            {
              config.platform === 'web' ? (
                <NetworkIndicator />
              ) : null
            }
            <div className='version'>当前版本号v{appVersion}</div>
          </div>
        </div>
      </Router>
    )
  }
}

module.exports = connect(
  state => ({
    playSound: state.getIn(['pc', 'playSound']),
    showLoading: state.getIn(['ui', 'showLoading']),
    showLoadingText: state.getIn(['ui', 'showLoadingText']),
    showAlert: state.getIn(['ui', 'showAlert']),
    showAlertInfo: state.getIn(['ui', 'showAlertInfo']),
  })
)(App);
