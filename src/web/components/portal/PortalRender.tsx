import React, { useContext } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { PortalContext } from './context';
import _isNil from 'lodash/isNil';
import ReactDOM from 'react-dom';

/**
 * @deprecated 应当使用@web/utils/portal
 */
export const PortalRender: React.FC = TMemo((props) => {
  const context = useContext(PortalContext);

  if (_isNil(context) || _isNil(context.ref.current)) {
    return null;
  }

  return ReactDOM.createPortal(props.children, context.ref.current);
});
PortalRender.displayName = 'PortalRender';
