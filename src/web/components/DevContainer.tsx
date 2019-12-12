import React, { Fragment } from 'react';
import { checkIsTestUser } from '@web/utils/debug-helper';

const DevContainer: React.FC<{}> = React.memo((props) => {
  return checkIsTestUser() ? <Fragment>{props.children}</Fragment> : null;
});

export default DevContainer;
