import React, { useContext } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { PortalContext } from './context';
import _isNil from 'lodash/isNil';
import ReactDOM from 'react-dom';

export const PortalRender: React.FC = TMemo((props) => {
  const context = useContext(PortalContext);

  if (_isNil(context) || _isNil(context.ref.current)) {
    return null;
  }

  return ReactDOM.createPortal(props.children, context.ref.current);
});
PortalRender.displayName = 'PortalRender';
