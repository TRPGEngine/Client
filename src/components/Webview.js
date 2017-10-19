const React = require('react');
const PropTypes = require('prop-types');
const NProgress = require('nprogress');

require('nprogress/nprogress.css');
require('./Webview.scss');

let webframeIndex = 0;

class Webview extends React.Component {
  constructor(props) {
    super(props);
    this.id = "webframe" + webframeIndex;
    webframeIndex++;
  }

  componentDidMount() {
    NProgress.configure({parent: "#"+this.id})
    NProgress.start();
    this.refs.webframe.src = this.props.src;
    this.refs.webframe.onload = function(e) {
      console.log('webview loadCompleted');
      NProgress.done();
    }
  }

  render() {
    return (
      <div className="webview" id={this.id}>
        <iframe ref="webframe" />
      </div>
    )
  }
}

Webview.propTypes = {
  src: PropTypes.string,
}

module.exports = Webview;
