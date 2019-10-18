import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Login from '@portal/sso/Login';

class App extends React.Component {
  render() {
    return (
      <BrowserRouter basename="/portal">
        <Switch>
          <Route name="login" path="/sso/login" component={Login} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
