import { TMemo } from '../TMemo';
import React, { useContext } from 'react';
import { PortalContext } from './context';
import { PortalConsumer } from './Consumer';
import _isNil from 'lodash/isNil';

export const PortalRender = TMemo((props) => {
  const manager = useContext(PortalContext);

  if (_isNil(manager)) {
    return null;
  }

  return <PortalConsumer manager={manager}>{props.children}</PortalConsumer>;
});
PortalRender.displayName = 'PortalRender';
