const React = require('react');
const { connect } = require('react-redux');
const {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Alert
} = require('react-native');
const { NavigationActions } = require('react-navigation');
const sb = require('react-native-style-block');
const config = require('../../../config/project.config');
const { replaceNav } = require('../../redux/actions/nav');

class LaunchScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      tipText: '',
      logoTop: new Animated.Value(0),//logo动画高度
      logoAlpha: new Animated.Value(0),//logo动画渐变
      tipAlpha: new Animated.Value(0),//文字渐变
    };
  }

  componentDidMount() {
    this.animationTimer = setTimeout(() => {
      if(config.environment === 'production') {
        Animated.sequence([
          Animated.parallel([
            Animated.spring(
              this.state.logoTop,{
                toValue: 20,
                duration: 3000,
              }
            ),
            Animated.spring(
              this.state.logoAlpha,{
                toValue: 1,
                duration: 3000,
              }
            ),
          ]),
          Animated.timing(
            this.state.tipAlpha,{
              toValue: 20,
              duration: 1000,
            }
          ),
        ])
        .start(() => {
          this._handleFinishAnimation();
        })
      }else {
        this._handleFinishAnimation();
      }
    }, 500);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.network.get('isOnline') === false) {
      return;
    }
    if(this.props.isTryLogin === true && nextProps.isTryLogin === false) {
      if(nextProps.isLogin) {
        this.props.dispatch(replaceNav('Main'));
      }else {
        this.props.dispatch(replaceNav('Login'));
      }
    }
  }

  componentWillUnmount() {
    clearTimeout(this.animationTimer);
  }

  _handleFinishAnimation() {
    if(this.props.network.get('isOnline') === false) {
      return;
    }

    if(this.props.isTryLogin) {
      this.setState({tipText: '正在尝试自动登陆...'});
    }else {
      if(this.props.isLogin) {
        this.props.dispatch(replaceNav('Main'));
      }else {
        this.props.dispatch(replaceNav('Login'));
      }
    }
  }

  render() {
    let network = this.props.network;
    let networkType = 'red';
    if(network.get('isOnline')) {
      networkType = 'green';
    }else if(network.get('tryReconnect')) {
      networkType = 'yellow';
    }

    return (
      <View style={styles.container}>
        <View style={styles.networkIndicator.container}>
          <View style={[styles.networkIndicator.common, styles.networkIndicator[networkType]]}></View>
          <Text>当前网络状态: {network.get('msg')}</Text>
        </View>

        <Animated.View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            marginTop: 60,
            top: this.state.logoTop,
            opacity: this.state.logoAlpha,
          }}
        >
          <Text style={styles.icon}>&#xe60b;</Text>
          <Text style={{textAlign: 'center',fontSize: 22}}>TRPG Game</Text>
        </Animated.View>

        <Animated.View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 80,
            opacity: this.state.tipAlpha,
          }}
        >
          <Text style={{textAlign: 'center',fontSize: 18}}>开始跑团吧!</Text>
        </Animated.View>
        <Text style={{position: 'absolute', left: 0, right: 0, bottom: 40, textAlign: 'center',fontSize: 14}}>{this.state.tipText}</Text>
      </View>
    )
  }
}

const styles = {
  container: [
    // sb.alignCenter(),
    sb.flex(),
    sb.padding(80, 20, 0),
    sb.bgColor('#f0d8bb'),
  ],
  icon: [
    {
      fontFamily: 'iconfont',
      fontSize: 200,
      textAlign: 'center',
      color: '#705949',
      textShadowOffset:{width:0,height:4},
      textShadowRadius:10,
      textShadowColor:'rgba(0,0,0,0.2)',
    },
  ],
  networkIndicator: {
    container: {
      position: 'absolute',
      left: 10,
      right: 0,
      top: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    common: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginRight: 4,
    },
    green: {
      backgroundColor: '#2ecc71'
    },
    yellow: {
      backgroundColor: '#f39c12'
    },
    red: {
      backgroundColor: '#c0392b'
    },
  }
}

module.exports = connect(
  state => ({
    isTryLogin: state.getIn(['user', 'isTryLogin']),
    isLogin: state.getIn(['user', 'isLogin']),
    network: state.getIn(['ui', 'network']),
  })
)(LaunchScreen);
