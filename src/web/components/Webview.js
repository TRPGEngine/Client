const React = require('react');
const PropTypes = require('prop-types');
const NProgress = require('nprogress');
const config = require('../../../config/project.config');

require('nprogress/nprogress.css');
require('./Webview.scss');

let webframeIndex = 0;
const isElectron = config.platform === 'electron';

class Webview extends React.Component {
  constructor(props) {
    super(props);
    this.id = 'webframe' + webframeIndex;
    webframeIndex++;
  }

  componentDidMount() {
    NProgress.configure({parent: '#'+this.id})
    NProgress.start();
    if(isElectron) {
      this.refs.webframe.src = this.props.src;
      this.refs.webframe.addEventListener('dom-ready', function() {
        console.log('webview loadCompleted');
        NProgress.done();
      })
      this.refs.webframe.addEventListener('will-navigate', function(e) {
        console.log('webview change, url:', e.url);
        NProgress.start();
      })
    }else {
      this.refs.webframe.src = this.props.src;
      this.refs.webframe.onload = function(e) {
        console.log('webview loadCompleted');
        NProgress.done();
      }
    }
  }

  render() {
    return (
      <div className="webview" id={this.id}>
        {
          isElectron ? (
            <webview ref="webframe" />
          ) : (
            <iframe ref="webframe" />
          )
        }
      </div>
    )
  }
}

Webview.propTypes = {
  src: PropTypes.string,
}

module.exports = Webview;
