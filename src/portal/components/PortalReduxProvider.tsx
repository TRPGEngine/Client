import React from 'react';
import { Provider } from 'react-redux';
import { TMemo } from '@shared/components/TMemo';
import configureStore from '@redux/configureStore';

/**
 * portal端不应该有redux但是有些组件必须要设置项因此加上
 */

const store = configureStore();
export const PortalReduxProvider: React.FC = TMemo((props) => {
  return <Provider store={store}>{props.children}</Provider>;
});
PortalReduxProvider.displayName = 'PortalReduxProvider';
