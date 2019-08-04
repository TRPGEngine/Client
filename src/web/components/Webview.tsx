import React from 'react';
import PropTypes from 'prop-types';
import NProgress from 'nprogress';
import config from '../../../config/project.config';
require('nprogress/nprogress.css');
import './Webview.scss';

let webframeIndex = 0;
const isElectron = config.platform === 'electron';

interface Props {
  src: string;
  allowExopen?: boolean;
}

class Webview extends React.Component<Props> {
  id: string;
  webframe: HTMLElement & { src: string };

  constructor(props) {
    super(props);
    this.id = 'webframe' + webframeIndex;
    webframeIndex++;
  }

  componentDidMount() {
    NProgress.configure({ parent: '#' + this.id });
    NProgress.start();
    if (isElectron) {
      this.webframe.src = this.props.src;
      this.webframe.addEventListener('dom-ready', function() {
        console.log('webview loadCompleted');
        NProgress.done();
      });
      this.webframe.addEventListener('will-navigate', function(e: any) {
        console.log('webview change, url:', e.url);
        NProgress.start();
      });
    } else {
      this.webframe.src = this.props.src;
      this.webframe.onload = function(e) {
        console.log('webview loadCompleted');
        NProgress.done();
      };
    }
  }

  handleOpenInNewWindow() {
    window.open(this.webframe.src, 'square', 'frame=true');
  }

  render() {
    return (
      <div className="webview" id={this.id}>
        {this.props.allowExopen && (
          <div
            className="open-new"
            title="在新窗口打开"
            onClick={() => this.handleOpenInNewWindow()}
          >
            <i className="iconfont">&#xe63c;</i>
          </div>
        )}
        {isElectron ? (
          <webview ref={(ref) => (this.webframe = ref as any)} />
        ) : (
          <iframe ref={(ref) => (this.webframe = ref)} />
        )}
      </div>
    );
  }
}

export default Webview;
