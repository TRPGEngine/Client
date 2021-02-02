import React from 'react';
import { Alert } from 'antd';
import type { RenderErrorComponent } from '@shared/components/ErrorBoundary';
import { TMemo } from '@shared/components/TMemo';

/**
 * 用于ErrorBoundary的错误视图
 */
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

/**
 * 用于接口错误显示的组件
 */
export const AlertErrorMessage: React.FC<{
  error: Error;
}> = TMemo((props) => {
  return (
    <Alert
      type="error"
      message={String(props.error.name)}
      description={String(props.error.message)}
    />
  );
});
AlertErrorMessage.displayName = 'AlertErrorMessage';
