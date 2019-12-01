import React, { ErrorInfo } from 'react';

interface ErrorData {
  error: Error;
  info: ErrorInfo;
}

interface Props {
  renderError: RenderErrorComponent;
}

interface State {
  hasError: boolean;
  errorInfo: ErrorData;
}

export type RenderErrorComponent = React.FC<ErrorData | null>;

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
    this.setState({
      errorInfo: {
        error,
        info: errorInfo,
      },
    });
  }

  render() {
    if (this.state.hasError) {
      return this.props.renderError(this.state.errorInfo);
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
