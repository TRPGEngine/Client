import React, { ErrorInfo } from 'react';
import _isFunction from 'lodash/isFunction';

interface ErrorData {
  error: Error;
  info: ErrorInfo;
}

export type HandleCatchErrorFn = (error: Error, errorInfo: ErrorInfo) => void;

interface Props {
  renderError: RenderErrorComponent;
  onCatchError?: HandleCatchErrorFn;
}

interface State {
  hasError: boolean;
  errorInfo: ErrorData | null;
}

export type RenderErrorComponent = React.ComponentType<ErrorData | null>;

/**
 * 通用的错误边界处理组件
 */
class ErrorBoundary extends React.Component<Props, State> {
  state: Readonly<State> = {
    hasError: false,
    errorInfo: null,
  };

  static getDerivedStateFromError(error) {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { onCatchError } = this.props;

    _isFunction(onCatchError) && onCatchError(error, errorInfo);
    this.setState({
      errorInfo: {
        error,
        info: errorInfo,
      },
    });
  }

  render() {
    if (this.state.hasError) {
      const errorInfo = this.state.errorInfo;
      const RenderComponent = this.props.renderError;
      return errorInfo ? (
        <RenderComponent error={errorInfo.error} info={errorInfo.info} />
      ) : null;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
