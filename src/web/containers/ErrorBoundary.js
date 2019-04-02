import React from 'react';
import {
  sendErrorReport,
  // showErrorDialog,
} from '../../shared/utils/errorReport';
import config from '../../../config/project.config.js';

require('./ErrorBoundary.scss');

// https://reactjs.org/docs/error-boundaries.html
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  handleShowReportDialog() {
    import('../utils/sentry').then((module) => module.showReportDialog());
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true });
    console.warn('捕获错误, 等待发送错误报告\n', error, info);
    sendErrorReport({
      message: String(error),
      stack: String(info.componentStack),
      version: config.version,
    });
    import('../utils/sentry').then((module) => module.error(error));
  }

  render() {
    if (this.state.hasError) {
      // TODO: 需要优化div结构。去除.app和#main
      return (
        <div className="app">
          <div id="main" className="error-boundary">
            <h1>啊哦Σ(ﾟдﾟ;), 出现了一些错误.</h1>
            <h2>
              错误已经汇报给TRPG后台, 请
              <span onClick={() => location.reload()}>刷新</span>一下页面重试哦.
            </h2>
            <p>
              <button
                className="showErrorReport"
                onClick={() => this.handleShowReportDialog()}
              >
                手动汇报详细错误
              </button>
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
