import React, { Fragment } from 'react';
import { checkIsTestUser } from '@web/utils/debug-helper';
import { TMemo } from '@shared/components/TMemo';

export const DevContainer: React.FC<{}> = TMemo((props) => {
  return checkIsTestUser() ? <Fragment>{props.children}</Fragment> : null;
});
DevContainer.displayName = 'DevContainer';

export default DevContainer;
