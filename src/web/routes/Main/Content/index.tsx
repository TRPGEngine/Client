import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { Personal } from './Personal';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Group } from './Group';
import { FindGroup } from './FindGroup';

interface MainContentProps {}
export const MainContent: React.FC<MainContentProps> = TMemo((props) => {
  return (
    <Switch>
      <Route name="personal" path="/main/personal">
        <Personal />
      </Route>
      <Route name="findGroup" path="/main/group/find">
        <FindGroup />
      </Route>
      <Route name="group" path="/main/group/:groupUUID">
        <Group />
      </Route>
      <Redirect to="/main/personal" />
    </Switch>
  );
});
MainContent.displayName = 'MainContent';
