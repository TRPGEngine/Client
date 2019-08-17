import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { View, Text, ActivityIndicator, BackHandler } from 'react-native';
import { WebView } from 'react-native-webview';
import sb from 'react-native-style-block';
import rnStorage from '../../api/rn-storage.api';
import { loginWithToken } from '../../redux/actions/user';
import { backNav } from '../redux/actions/nav';
import { NavigationScreenProps } from 'react-navigation';

class Loading extends React.Component {
  render() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 100,
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }
}

class LoadError extends React.Component<{ url: string }> {
  render() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 100,
        }}
      >
        <Text>加载出错啦!</Text>
        <Text>请检查地址: {this.props.url}</Text>
      </View>
    );
  }
}

type WebviewScreenProps = NavigationScreenProps & DispatchProp<any>;
class WebviewScreen extends React.Component<WebviewScreenProps> {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: navigation.getParam('title', '加载中...'),
    };
  };

  canGoBack = false;
  webview: WebView;

  constructor(props) {
    super(props);
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

  handleStateChange(state) {
    let { loading, title, url, canGoForward, canGoBack, target } = state;

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

  render() {
    let { url } = this.props.navigation.state.params;

    return (
      <WebView
        ref={(ref) => (this.webview = ref)}
        source={{ uri: url }}
        startInLoadingState={true}
        renderLoading={() => <Loading />}
        renderError={() => <LoadError url={url} />}
        mixedContentMode={'compatibility'}
        onNavigationStateChange={(state) => this.handleStateChange(state)}
        onMessage={(e) => this.handleMessage(e)}
      />
    );
  }
}

export default connect()(WebviewScreen);
