import React from 'react';
import { Router, Switch, Route } from 'react-router';
import { createBrowserHistory } from 'history';
import ActorEditor from './actor-editor';

const history = createBrowserHistory({
  basename: '/playground',
});

const App: React.FC = React.memo((props) => {
  return (
    <Router history={history}>
      <Switch>
        <Route exact path="/" component={ActorEditor} />
      </Switch>
    </Router>
  );
});

export default App;
