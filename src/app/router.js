const React = require('react');
const PropTypes = require('prop-types');
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
  reduxifyNavigator,
} from 'react-navigation-redux-helpers';
const { connect } = require('react-redux');
const {
  createStackNavigator,
  createBottomTabNavigator,
} = require('react-navigation');

const LaunchScreen = require('./screens/LaunchScreen');
const LoginScreen = require('./screens/LoginScreen');
const RegisterScreen = require('./screens/RegisterScreen');
const HomeScreen = require('./screens/HomeScreen');
const AccountScreen = require('./screens/AccountScreen');
const ContactsScreen = require('./screens/ContactsScreen');
const ChatScreen = require('./screens/ChatScreen');
const AddFriendScreen = require('./screens/AddFriendScreen');
const SettingsScreen = require('./screens/SettingsScreen');
const ProfileScreen = require('./screens/ProfileScreen');
const GroupProfileScreen = require('./screens/GroupProfileScreen');
const PhotoBrowserScreen = require('./screens/PhotoBrowserScreen');
const ProfileModifyScreen = require('./screens/ProfileModifyScreen');
const WebviewScreen = require('./screens/WebviewScreen');

const MainNavigator = createBottomTabNavigator({
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

const AppNavigator = createStackNavigator({
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
  PhotoBrowser: {
    screen: PhotoBrowserScreen,
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
});

const middleware = createReactNavigationReduxMiddleware('root', (state) =>
  state.get('nav')
);

const App = reduxifyNavigator(AppNavigator, 'root');

class ReduxNavigation extends React.Component {
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
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
  };
};

module.exports = {
  middleware,
  MainNavigator,
  AppNavigator,
  AppWithNavigationState: connect(mapStateToProps)(ReduxNavigation),
};
