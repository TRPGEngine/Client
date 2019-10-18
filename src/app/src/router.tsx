import React from 'react';
import { Text, View, BackHandler, ToastAndroid } from 'react-native';
import {
  NavigationActions,
  createStackNavigator,
  createBottomTabNavigator,
} from 'react-navigation';
import {
  createReactNavigationReduxMiddleware,
  createReduxContainer,
} from 'react-navigation-redux-helpers';
import { connect, DispatchProp } from 'react-redux';
import { StackViewStyleInterpolator } from 'react-navigation-stack';
import { uiHandlerCollection } from './utils/ui-state-handler';
import _get from 'lodash/get';

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
import DeviceInfoScreen from './screens/settings/DeviceInfoScreen';
import DevelopLabScreen from './screens/settings/DevelopLabScreen';
import VersionScreen from './screens/VersionScreen';
import CreateGroupScreen from './screens/CreateGroupScreen';
import GroupDataScreen from './screens/GroupDataScreen';
import DebugScreen from './screens/DebugScreen';

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
    Settings: {
      screen: SettingsScreen,
      navigationOptions: {
        headerTitle: '设置',
      },
    },
    SettingsDeviceInfo: {
      screen: DeviceInfoScreen,
      navigationOptions: {
        headerTitle: '设备信息',
      },
    },
    SettingsDevelopLab: {
      screen: DevelopLabScreen,
      navigationOptions: {
        headerTitle: '开发实验室',
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
    CreateGroup: {
      screen: CreateGroupScreen,
      navigationOptions: {
        headerTitle: '创建新团',
      },
    },
    GroupData: {
      screen: GroupDataScreen,
      navigationOptions: ({ navigation }) => ({
        headerTitle: _get(navigation, 'state.params.name', '详细信息'),
      }),
    },
    Version: {
      screen: VersionScreen,
      navigationOptions: {
        headerTitle: '版本信息',
      },
    },
    Debug: {
      screen: DebugScreen,
      navigationOptions: {
        headerTitle: '调试面板',
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
  (state: any) => state.get('nav'),
  'root'
);

const App = createReduxContainer(AppNavigator, 'root');

interface ReduxNavigationProps extends DispatchProp<any> {
  ui: any;
  state: any;
}
class ReduxNavigation extends React.Component<ReduxNavigationProps> {
  lastBackPressed: any;

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
    const dispatch = this.props.dispatch;
    const args: [any, any, any] = [prevUI, currentUI, dispatch];

    uiHandlerCollection.forEach((handle) => handle(...args));
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
