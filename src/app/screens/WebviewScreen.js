const React = require('react');
const { connect } = require('react-redux');
const {
  View,
  Text,
  WebView,
  ActivityIndicator,
  BackHandler,
} = require('react-native');
const sb = require('react-native-style-block');

class Loading extends React.Component {
  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 100}}>
        <ActivityIndicator size="large" />
      </View>
    )
  }
}

class LoadError extends React.Component {
  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 100}}>
        <Text>加载出错啦!</Text>
        <Text>请检查地址: {this.props.url}</Text>
      </View>
    )
  }
}

class WebviewScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: navigation.getParam('title', '加载中...'),
    };
  };

  constructor(props) {
    super(props);
    this.canGoBack = false;
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
  }

  onBackPress = () => {
    if(this.canGoBack) {
      // 可以回退
      this.refs.webview.goBack();
      return true;
    }else {
      // 不能回退
      return false;
    }
  };

  _handleStateChange(state) {
    let {loading, title, url, canGoForward, canGoBack, target} = state;

    this.props.navigation.setParams({ title });
    this.canGoBack = canGoBack;
  }

  render() {
    let { url } = this.props.navigation.state.params;

    return (
      <WebView
        ref="webview"
        source={{uri: url}}
        startInLoadingState={true}
        renderLoading={() => (<Loading />)}
        renderError={() => (<LoadError url={url} />)}
        mixedContentMode={'compatibility'}
        onNavigationStateChange={(state) => this._handleStateChange(state)}
      />
    )
  }
}

module.exports = connect()(WebviewScreen);
