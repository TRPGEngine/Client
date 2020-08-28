import React, { Fragment } from 'react';
import { checkIsTestUser } from '@web/utils/debug-helper';

export const DevContainer: React.FC<{}> = React.memo((props) => {
  return checkIsTestUser() ? <Fragment>{props.children}</Fragment> : null;
});
DevContainer.displayName = 'DevContainer';

export default DevContainer;
