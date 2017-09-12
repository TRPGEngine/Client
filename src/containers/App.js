import React from 'react';
import { connect } from 'react-redux';
const { Route, Redirect, Switch, BrowserRouter, Link } = require('react-router-dom');
const Router = BrowserRouter;
const Modal = require('../components/Modal');
const Loading = require('../components/Loading');
const Alert = require('../components/Alert');
const NetworkIndicator = require('../components/NetworkIndicator');
require('./App.scss');
require('../assets/css/iconfont.css');

const appConfig = require('../../package.json');
const appVersion = appConfig.version;
const Login = require('./Login');
const Register = require('./Register');
const Main = require('./Main');

class App extends React.Component {
  render() {
    const {showLoading, showAlert, showAlertInfo} = this.props;
    let alertInfo = showAlertInfo.toJS();
    return (
      <Router>
        <div>
          <Modal />
          <Loading show={showLoading} />
          <Alert
            show={showAlert}
            title={alertInfo.title}
            content={alertInfo.content}
            type={alertInfo.type || 'alert'}
            onConfirm={alertInfo.onConfirm} />
          <div className="app">
            <Switch>
              <Route name="login" path="/login" component={Login} />
              <Route name="register" path="/register" component={Register} />
              <Route name="main" path="/main" component={Main} />
            </Switch>
            <NetworkIndicator />
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
    showAlert: state.getIn(['ui', 'showAlert']),
    showAlertInfo: state.getIn(['ui', 'showAlertInfo']),
  })
)(App);
