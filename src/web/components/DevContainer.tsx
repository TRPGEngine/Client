import React, { Fragment } from 'react';
import { checkIsDeveloper } from '@web/utils/debug-helper';
import { TMemo } from '@shared/components/TMemo';

export const DevContainer: React.FC<{}> = TMemo((props) => {
  return checkIsDeveloper() ? <Fragment>{props.children}</Fragment> : null;
});
DevContainer.displayName = 'DevContainer';

export default DevContainer;
