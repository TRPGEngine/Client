import React from 'react';
import { Alert } from 'antd';
import type { RenderErrorComponent } from '@shared/components/ErrorBoundary';
import { TMemo } from '@shared/components/TMemo';

export const AlertErrorView: RenderErrorComponent = TMemo((props) => {
  return (
    <Alert
      type="error"
      message={String(props?.error)}
      description={props?.info.componentStack}
    />
  );
});
AlertErrorView.displayName = 'AlertErrorView';
