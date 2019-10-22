import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Login from '@portal/sso/Login';
import ActorEditor from './actor/editor';

class App extends React.Component {
  render() {
    return (
      <BrowserRouter basename="/portal">
        <Switch>
          <Route name="login" path="/sso/login" component={Login} />
          <Route
            name="actor-editor"
            path="/actor/editor"
            component={ActorEditor}
          />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
