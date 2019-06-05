import React from 'react';
import PropTypes from 'prop-types';
import {
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  StatusBar,
  View,
  Button,
  BackHandler,
  ToastAndroid,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import {
  createReactNavigationReduxMiddleware,
  createReduxContainer,
} from 'react-navigation-redux-helpers';
import { connect } from 'react-redux';
import {
  createStackNavigator,
  createBottomTabNavigator,
} from 'react-navigation';
import { StackViewStyleInterpolator } from 'react-navigation-stack';

import LaunchScreen from './screens/LaunchScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import AccountScreen from './screens/AccountScreen';
import ContactsScreen from './screens/ContactsScreen';
import ChatScreen from './screens/ChatScreen';
import AddFriendScreen from './screens/AddFriendScreen';
import SettingsScreen from './screens/SettingsScreen';
import ProfileScreen from './screens/ProfileScreen';
import GroupProfileScreen from './screens/GroupProfileScreen';
import ProfileModifyScreen from './screens/ProfileModifyScreen';
import WebviewScreen from './screens/WebviewScreen';
import TAlert from './components/TApi/TAlert';

import { hideAlert } from '../redux/actions/ui';

export const MainNavigator = createBottomTabNavigator({
  TRPG: {
    screen: HomeScreen,
  },
  Contacts: {
    screen: ContactsScreen,
  },
  Account: {
    screen: AccountScreen,
  },
});

const DetailsScreen = () => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>Details Screen</Text>
  </View>
);

export const AppNavigator = createStackNavigator(
  {
    LaunchScreen: {
      screen: LaunchScreen,
    },
    Login: {
      screen: LoginScreen,
      navigationOptions: {
        headerLeft: null,
      },
    },
    Register: {
      screen: RegisterScreen,
      navigationOptions: {
        headerTitle: '注册TRPG Game账户',
      },
    },
    Main: {
      screen: MainNavigator,
      navigationOptions: {
        headerLeft: null,
        title: 'TRPG Game',
      },
    },
    Details: {
      screen: DetailsScreen,
      navigationOptions: {
        headerTitle: 'Details',
      },
    },
    Settings: {
      screen: SettingsScreen,
      navigationOptions: {
        headerTitle: '设置',
      },
    },
    Chat: {
      screen: ChatScreen,
      navigationOptions: ({ navigation }) => ({
        headerTitle: '与 ' + navigation.state.params.name + ' 的聊天',
        gesturesEnabled: true,
      }),
    },
    AddFriend: {
      screen: AddFriendScreen,
      navigationOptions: {
        headerTitle: '添加联系人',
      },
    },
    Profile: {
      screen: ProfileScreen,
      navigationOptions: ({ navigation }) => ({
        headerTitle: navigation.state.params.name + ' 的个人信息',
      }),
    },
    GroupProfile: {
      screen: GroupProfileScreen,
      navigationOptions: ({ navigation }) => ({
        headerTitle: navigation.state.params.name + ' 可以公开的情报',
      }),
    },
    ProfileModify: {
      screen: ProfileModifyScreen,
      navigationOptions: {
        headerTitle: '编辑资料',
      },
    },
    Webview: {
      screen: WebviewScreen,
    },
  },
  {
    mode: 'card',
    defaultNavigationOptions: {
      gesturesEnabled: false,
    },
    transitionConfig: () => ({
      screenInterpolator: StackViewStyleInterpolator.forHorizontal,
    }),
  }
);

export const middleware = createReactNavigationReduxMiddleware(
  (state) => state.get('nav'),
  'root'
);

const App = createReduxContainer(AppNavigator, 'root');

class ReduxNavigation extends React.Component {
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }

  componentDidUpdate(prevProps) {
    this.handleUIChange(prevProps.ui, this.props.ui);
  }

  // 处理UI的状态
  handleUIChange(prevUI, currentUI) {
    if (
      prevUI.get('showAlert') === false &&
      currentUI.get('showAlert') === true
    ) {
      // 当alert打开
      TAlert.show(currentUI.get('showAlertInfo'), {
        onRequestClose: () => this.props.dispatch(hideAlert()),
      });
    }

    if (
      prevUI.get('showAlert') === true &&
      currentUI.get('showAlert') === false
    ) {
      // 当alert关闭
      TAlert.hide();
    }
  }

  onBackPress = () => {
    const { dispatch, state } = this.props;

    if (state.index !== 0) {
      dispatch(NavigationActions.back());
      return true;
    } else {
      // 到达主页
      if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
        // 最近两秒内按过back 可以退出应用
        return false;
      }

      this.lastBackPressed = Date.now();
      ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);
      return true;
    }
  };

  render() {
    const { dispatch, state } = this.props;
    return <App dispatch={dispatch} state={state} />;
  }
}

const mapStateToProps = (state) => {
  return {
    state: state.get('nav'),
    ui: state.get('ui'),
  };
};

export const AppWithNavigationState = connect(mapStateToProps)(ReduxNavigation);
