import React from 'react';
import { Alert } from 'antd';
import { RenderErrorComponent } from '@shared/components/ErrorBoundary';
import { TMemo } from '@shared/components/TMemo';

export const PortalErrorView: RenderErrorComponent = TMemo((props) => {
  return (
    <Alert
      type="error"
      message={String(props?.error)}
      description={props?.info.componentStack}
    />
  );
});
PortalErrorView.displayName = 'PortalErrorView';
