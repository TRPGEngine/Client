import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import {
  View,
  Text,
  ActivityIndicator,
  BackHandler,
  Linking,
  NativeSyntheticEvent,
} from 'react-native';
import { WebView } from 'react-native-webview';
import rnStorage from '@shared/api/rn-storage.api';
import { loginWithToken } from '@shared/redux/actions/user';
import { NavigationScreenProps } from 'react-navigation';
import { TIcon } from '@app/components/TComponent';
import styled from 'styled-components/native';
import {
  WebViewNavigationEvent,
  WebViewNavigation,
  WebViewNativeProgressEvent,
  WebViewMessage,
} from 'react-native-webview/lib/WebViewTypes';
import _isNil from 'lodash/isNil';
import _isEmpty from 'lodash/isEmpty';
import _isString from 'lodash/isString';
import PDFRender from './pdf';

const TipContainer = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  align-items: center;
  justify-content: center;
`;

const LoadingBar = styled.View<{ color: string; percent: number }>`
  background-color: ${(props) => props.color};
  width: ${(props) => props.percent * 100}%;
  height: 3px;
  position: absolute;
  z-index: 10px;
  top: 0;
  left: 0;
`;

const Loading = React.memo(() => (
  <TipContainer>
    <ActivityIndicator size="large" />
  </TipContainer>
));

const LoadError = React.memo((props: { url: string }) => (
  <TipContainer>
    <Text>加载出错啦!</Text>
    <Text>请检查地址: {props.url}</Text>
  </TipContainer>
));

export type WebviewAfterLoadCallback = (
  webview: WebView,
  e: WebViewNavigationEvent
) => void;

export interface WebviewMessageCallbackData {
  type: string;
  [other: string]: any;
}
export type WebviewMessageCallback = (data: WebviewMessageCallbackData) => void;

type WebviewScreenProps = NavigationScreenProps<{
  url: string;
  title?: string;
  injectedJavaScript?: string;
  afterLoad?: WebviewAfterLoadCallback;
}> &
  DispatchProp<any>;
class WebviewScreen extends React.Component<WebviewScreenProps> {
  static navigationOptions = ({ navigation }) => {
    const url = navigation.getParam('url');

    return {
      headerTitle: navigation.getParam('title', '加载中...'),
      headerRight: (
        <View style={{ marginRight: 10 }}>
          <TIcon
            icon="&#xe63c;"
            style={{ fontSize: 26 } as any}
            onPress={async () => {
              if (await Linking.canOpenURL(url)) {
                Linking.openURL(url);
              }
            }}
          />
        </View>
      ),
    };
  };

  state = {
    visible: false,
    percent: 0, //range:  0 - 1
    color: '#3B78E7',
  };
  errorColor = '#f30';
  disappearDuration = 300;
  canGoBack = false;
  webview: WebView;
  timer: number;
  _messageCb: { [messageType: string]: WebviewMessageCallback[] };

  get url(): string {
    return this.props.navigation.getParam('url', '');
  }

  get isPDF(): boolean {
    return this.url.endsWith('.pdf');
  }

  get injectedJavaScript(): string | undefined {
    return this.props.navigation.getParam('injectedJavaScript');
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    clearTimeout(this.timer);
  }

  setTitle = (title: string) => {
    this.props.navigation.setParams({
      title,
    });
  };

  /**
   * 发送消息到webview
   * TODO: 未测试
   */
  postMessage(type: string, other: {}) {
    if (this.webview) {
      (this.webview as any).postMessage(
        JSON.stringify({
          type,
          ...other,
        })
      );
    }
  }

  onBackPress = () => {
    if (this.canGoBack && this.webview) {
      // 可以回退
      this.webview.goBack();
      return true;
    } else {
      // 不能回退
      return false;
    }
  };

  /**
   * 增加监听方法
   * @param type 监听的message type
   * @param fn 方法回调
   */
  on(type: string, fn: WebviewMessageCallback) {
    if (_isNil(this._messageCb[type])) {
      this._messageCb[type] = [];
    }

    this._messageCb[type].push(fn);
  }

  /**
   * 发送回调到各个事件监听器
   * @param type 发送的message type
   * @param data message信息
   */
  emit(type: string, data: WebviewMessageCallbackData) {
    if (_isNil(this._messageCb[type]) || _isEmpty(this._messageCb[type])) {
      return;
    }

    for (const cb of this._messageCb[type]) {
      cb(data);
    }
  }

  handleLoadStart = () => {
    this.setState({ visible: true });
  };
  handleLoadEnd = () => {
    this.timer = setTimeout(() => {
      this.setState({ visible: false });
    }, this.disappearDuration);
  };
  handleLoadProgress = (
    e: NativeSyntheticEvent<WebViewNativeProgressEvent>
  ) => {
    this.setState({ percent: e.nativeEvent.progress });
  };
  handleLoadProgressPdf = (percent: number) => {
    this.setState({ visible: true, percent });
  };
  handleError = () => {
    this.setState({ color: this.errorColor, percent: 1 });
  };

  handleStateChange(state: WebViewNavigation) {
    let { loading, title, url, canGoForward, canGoBack } = state;

    this.setTitle(title);
    this.canGoBack = canGoBack;
  }

  handleMessage = (e: NativeSyntheticEvent<WebViewMessage>) => {
    console.log('On Message Data:', e.nativeEvent.data);
    const json = e.nativeEvent.data;
    try {
      const data: WebviewMessageCallbackData = JSON.parse(json);
      const type = data.type;
      if (type === 'onOAuthFinished') {
        // 处理OAuth登录
        let { uuid, token } = data;
        if (!uuid || !token) {
          console.error('oauth登录失败, 缺少必要参数', uuid, token);
          return;
        }

        // 注册新的uuid与token并刷新
        rnStorage.set('uuid', uuid);
        rnStorage.set('token', token);

        this.props.dispatch(loginWithToken(uuid, token, 'qq'));
      } else if (_isString(type)) {
        // 处理其他事件
        this.emit(type, data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  handleLoad = (e: WebViewNavigationEvent) => {
    const afterLoadFn = this.props.navigation.getParam('afterLoad');
    if (afterLoadFn && this.webview) {
      afterLoadFn(this.webview, e);
    }
  };

  render() {
    const url = this.url;

    return (
      <View style={{ flex: 1 }}>
        {this.state.visible && (
          <LoadingBar color={this.state.color} percent={this.state.percent} />
        )}
        {this.isPDF ? (
          // 如果是PDF网络地址时。使用pdf阅览器
          <PDFRender
            url={url}
            onLoadProgress={this.handleLoadProgressPdf}
            onLoadComplete={this.handleLoadEnd}
            onError={this.handleError}
            onChangeTitle={this.setTitle}
          />
        ) : (
          <WebView
            ref={(ref) => (this.webview = ref)}
            source={{ uri: url }}
            injectedJavaScript={this.injectedJavaScript}
            startInLoadingState={true}
            renderLoading={() => <Loading />}
            renderError={() => <LoadError url={url} />}
            mixedContentMode={'compatibility'}
            onNavigationStateChange={(state) => this.handleStateChange(state)}
            onMessage={this.handleMessage}
            onLoad={this.handleLoad}
            onLoadStart={this.handleLoadStart}
            onLoadEnd={this.handleLoadEnd}
            onLoadProgress={this.handleLoadProgress}
            onError={this.handleError}
          />
        )}
      </View>
    );
  }
}

export default connect()(WebviewScreen);
