import React from 'react';
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import sb from 'react-native-style-block';
import config from '@shared/project.config';
import { Modal } from '@ant-design/react-native';
import SystemStatus from '../components/SystemStatus';
import type { TRPGState, TRPGDispatchProp } from '@redux/types/__all__';
import { TRPGStackScreenProps } from '@app/router';
import { resetScreenAction } from '@app/navigate/actions';

interface Props extends TRPGDispatchProp, TRPGStackScreenProps<'LaunchScreen'> {
  isTryLogin: boolean;
  isLogin: boolean;
  network: any;
}
class LaunchScreen extends React.Component<Props> {
  animationTimer: number;
  state = {
    tipText: '',
    logoTop: new Animated.Value(0), // logo动画高度
    logoAlpha: new Animated.Value(0), // logo动画渐变
    tipAlpha: new Animated.Value(0), // 文字渐变
    isShowSystemStatusModal: false, // 是否显示系统状态模态框
  };

  componentDidMount() {
    this.animationTimer = setTimeout(() => {
      if (config.environment === 'production') {
        Animated.sequence([
          Animated.parallel([
            Animated.spring(this.state.logoTop, {
              toValue: 20,
              useNativeDriver: false,
              // duration: 3000,
            }),
            Animated.spring(this.state.logoAlpha, {
              toValue: 1,
              useNativeDriver: false,
              // duration: 3000,
            }),
          ]),
          Animated.timing(this.state.tipAlpha, {
            toValue: 20,
            useNativeDriver: false,
            // duration: 1000,
          }),
        ]).start(() => {
          this.handleFinishAnimation();
        });
      } else {
        this.handleFinishAnimation();
      }
    }, 500);
  }

  componentDidUpdate(prevProps: Readonly<Props>) {
    if (this.props.network.isOnline === false) {
      return;
    }

    if (prevProps.isTryLogin === true && this.props.isTryLogin === false) {
      if (this.props.isLogin) {
        this.props.navigation.replace('Main');
      } else {
        this.props.navigation.replace('Login');
      }
    }
  }

  componentWillUnmount() {
    clearTimeout(this.animationTimer);
  }

  handleFinishAnimation() {
    if (this.props.network.isOnline === false) {
      return;
    }

    if (this.props.isTryLogin) {
      this.setState({ tipText: '正在尝试自动登陆...' });
    } else {
      if (this.props.isLogin) {
        this.props.navigation.dispatch(resetScreenAction('Main'));
      } else {
        this.props.navigation.dispatch(resetScreenAction('Login'));
      }
    }
  }

  /**
   * 服务状态框
   * 用于查看服务器连接问题
   */
  getSystemStatusModal() {
    return (
      <Modal
        transparent={false}
        popup={true}
        visible={this.state.isShowSystemStatusModal}
        maskClosable={true}
        onClose={() => {
          this.setState({ isShowSystemStatusModal: false });
        }}
      >
        <SystemStatus />
      </Modal>
    );
  }

  render() {
    const network = this.props.network;
    let networkType = 'red';
    if (network.isOnline) {
      networkType = 'green';
    } else if (network.tryReconnect) {
      networkType = 'yellow';
    }

    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.networkIndicator.container as any}
          onPress={() => this.setState({ isShowSystemStatusModal: true })}
        >
          <View
            style={[
              styles.networkIndicator.common,
              styles.networkIndicator[networkType],
            ]}
          />
          <Text>当前网络状态: {network.msg}</Text>
        </TouchableOpacity>

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
          <Text style={styles.icon as any}>&#xe60b;</Text>
          <Text style={{ textAlign: 'center', fontSize: 22 }}>TRPG Game</Text>
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
          <Text style={{ textAlign: 'center', fontSize: 18 }}>开始跑团吧!</Text>
        </Animated.View>
        <Text
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 40,
            textAlign: 'center',
            fontSize: 14,
          }}
        >
          {this.state.tipText}
        </Text>

        {this.getSystemStatusModal()}
      </View>
    );
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
      textShadowOffset: { width: 0, height: 4 },
      textShadowRadius: 10,
      textShadowColor: 'rgba(0,0,0,0.2)',
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
      backgroundColor: '#2ecc71',
    },
    yellow: {
      backgroundColor: '#f39c12',
    },
    red: {
      backgroundColor: '#c0392b',
    },
  },
};

export default connect((state: TRPGState) => ({
  isTryLogin: state.user.isTryLogin,
  isLogin: state.user.isLogin,
  network: state.ui.network,
}))(LaunchScreen);
