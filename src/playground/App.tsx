import React from 'react';
import { Router, Switch, Route } from 'react-router';
import { createBrowserHistory } from 'history';
import ActorEditor from './actor-editor';
import ActorTemplatePreviewer from './preview';

const history = createBrowserHistory({
  basename: '/playground',
});

const App: React.FC = React.memo((props) => {
  return (
    <Router history={history}>
      <Switch>
        <Route exact={true} path="/" component={ActorEditor} />
        <Route exact={true} path="/preview" component={ActorTemplatePreviewer} />
      </Switch>
    </Router>
  );
});

export default App;
