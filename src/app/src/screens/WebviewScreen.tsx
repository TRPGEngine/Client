import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import {
  View,
  Text,
  ActivityIndicator,
  BackHandler,
  Linking,
} from 'react-native';
import { WebView } from 'react-native-webview';
import sb from 'react-native-style-block';
import rnStorage from '../../../shared/api/rn-storage.api';
import { loginWithToken } from '../../../shared/redux/actions/user';
import { backNav } from '../redux/actions/nav';
import { NavigationScreenProps } from 'react-navigation';
import { TIcon } from '../components/TComponent';
import styled from 'styled-components/native';
import {
  WebViewNavigationEvent,
  WebViewNavigation,
} from 'react-native-webview/lib/WebViewTypes';

const TipContainer = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  align-items: center;
  justify-content: center;
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

  canGoBack = false;
  webview: WebView;

  constructor(props) {
    super(props);
  }

  get url(): string {
    return this.props.navigation.getParam('url', '');
  }

  get injectedJavaScript(): string | undefined {
    return this.props.navigation.getParam('injectedJavaScript');
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
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

  handleStateChange(state: WebViewNavigation) {
    let { loading, title, url, canGoForward, canGoBack } = state;

    this.props.navigation.setParams({ title });
    this.canGoBack = canGoBack;
  }

  handleMessage(e) {
    console.log('On Message Data:', e.nativeEvent.data);
    let data = e.nativeEvent.data;
    try {
      data = JSON.parse(data);
      if (data.type === 'onOAuthFinished') {
        let { uuid, token } = data;
        if (!uuid || !token) {
          console.error('oauth登录失败, 缺少必要参数', uuid, token);
          return;
        }

        // 注册新的uuid与token并刷新
        rnStorage.set('uuid', uuid);
        rnStorage.set('token', token);

        this.props.dispatch(loginWithToken(uuid, token, 'qq'));
      }
    } catch (err) {
      console.error(err);
    }
  }

  handleLoad = (e: WebViewNavigationEvent) => {
    const afterLoadFn = this.props.navigation.getParam('afterLoad');
    if (afterLoadFn && this.webview) {
      afterLoadFn(this.webview, e);
    }
  };

  render() {
    const url = this.url;

    return (
      <WebView
        ref={(ref) => (this.webview = ref)}
        source={{ uri: url }}
        injectedJavaScript={this.injectedJavaScript}
        startInLoadingState={true}
        renderLoading={() => <Loading />}
        renderError={() => <LoadError url={url} />}
        mixedContentMode={'compatibility'}
        onNavigationStateChange={(state) => this.handleStateChange(state)}
        onMessage={(e) => this.handleMessage(e)}
        onLoad={this.handleLoad}
      />
    );
  }
}

export default connect()(WebviewScreen);
