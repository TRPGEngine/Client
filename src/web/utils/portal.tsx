import React from 'react';
import { buildPortal, DefaultEventEmitter } from '@shared/components/portal';

const eventEmitter = new DefaultEventEmitter();

const { PortalHost, PortalRender, add, remove } = buildPortal({
  hostName: 'default',
  eventEmitter,
  renderManagerView: (children) => <div>{children}</div>,
});

export { PortalHost, PortalRender, add as PortalAdd, remove as PortalRemove };
