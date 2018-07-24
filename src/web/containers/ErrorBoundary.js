const React = require('react');
const { sendErrorReport } = require('../../utils/errorReport');

require('./ErrorBoundary.scss');

// https://reactjs.org/docs/error-boundaries.html
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true });
    console.warn('捕获错误, 等待发送错误报告\n', error, info);
    sendErrorReport({
      message:  String(error),
      stack: String(info.componentStack)
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h1>啊哦Σ(ﾟдﾟ;), 出现了一些错误.</h1>
          <h2>错误已经汇报给TRPG后台, 请<span onClick={() => location.reload()}>刷新</span>一下页面重试哦.</h2>
        </div>
      );
    }
    return this.props.children;
  }
}

module.exports = ErrorBoundary;
