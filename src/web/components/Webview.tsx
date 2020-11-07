import React, { Fragment } from 'react';
import config from '@shared/project.config';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import './Webview.scss';
import { Result } from 'antd';

let webframeIndex = 0;
const isElectron = config.platform === 'electron';

function WebviewError(props: { message?: string }) {
  return (
    <Result
      status="warning"
      title="页面无法正常打开"
      subTitle={props.message}
    />
  );
}

interface Props {
  src: string;
  allowExopen?: boolean;
}

class Webview extends React.Component<Props> {
  id: string;
  webframe?: HTMLElement & { src: string };

  static defaultProps: Partial<Props> = {
    allowExopen: false,
  };

  state = {
    isError: false,
    errorMsg: '',
  };

  constructor(props: Props) {
    super(props);
    this.id = 'webframe' + webframeIndex;
    webframeIndex++;
  }

  componentDidMount() {
    NProgress.configure({ parent: '#' + this.id });
    NProgress.start();
    const webframe = this.webframe!;
    if (isElectron) {
      webframe.src = this.props.src;
      webframe.addEventListener('dom-ready', function () {
        console.log('webview loadCompleted');
        if (NProgress.isRendered()) {
          NProgress.done();
        }
      });
      webframe.addEventListener('will-navigate', function (e: any) {
        console.log('webview change, url:', e.url);
        NProgress.start();
      });
    } else {
      webframe.src = this.props.src;
      webframe.onload = function (e) {
        console.log('webview loadCompleted');
        if (NProgress.isRendered()) {
          NProgress.done();
        }
      };
    }
  }

  componentWillUnmount() {
    if (NProgress.isRendered()) {
      NProgress.done();
      NProgress.remove();
    }
  }

  handleOpenInNewWindow() {
    window.open(this.webframe!.src, 'square', 'frame=true');
  }

  handleError = (e: React.SyntheticEvent<HTMLIFrameElement, Event>) => {
    NProgress.done();
    NProgress.remove();
    this.setState({
      isError: true,
      errorMsg: `页面加载失败: ${this.props.src}`,
    });
  };

  render() {
    let inner: React.ReactNode = null;

    if (this.state.isError) {
      inner = <WebviewError message={this.state.errorMsg} />;
    } else {
      inner = (
        <Fragment>
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
            <iframe
              ref={(ref) => (this.webframe = ref as any)}
              onError={this.handleError}
            >
              <p>请使用现代浏览器打开本页面</p>
            </iframe>
          )}
        </Fragment>
      );
    }

    return (
      <div className="webview" id={this.id}>
        {inner}
      </div>
    );
  }
}

export default Webview;
