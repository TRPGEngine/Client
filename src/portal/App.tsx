import React from 'react';
import { Router, Switch, Route, RouteProps } from 'react-router';
import { postMessage } from '@portal/utils/event';
import history from './history';
import { routes } from './routes';
import NotFound from './routes/404';
import { TMemo } from '@shared/components/TMemo';

interface TitleRouteProps extends RouteProps {
  title: string;
}
const TitleRoute: React.FC<TitleRouteProps> = TMemo((route) => {
  const { path, title } = route;

  return (
    <Route
      path={path}
      render={(props) => {
        document.title = title || 'TRPG Portal';

        postMessage('common::updatePath', {
          title: document.title,
          path,
        });

        const Component = route.component as any;
        return <Component {...props}>{route.children}</Component>;
      }}
    />
  );
});
TitleRoute.displayName = 'TitleRoute';

class App extends React.Component {
  render() {
    return (
      <Router history={history}>
        <Switch>
          {routes.map((config) => (
            <TitleRoute key={config.path} {...config} />
          ))}
          <Route component={NotFound} />
        </Switch>
      </Router>
    );
  }
}

export default App;
