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
  createNavigationPropConstructor,
  initializeListeners
} from 'react-navigation-redux-helpers';
const { connect } = require('react-redux');
const { createStackNavigator, createBottomTabNavigator } = require('react-navigation');

const LaunchScreen = require('./screens/LaunchScreen');
const LoginScreen = require('./screens/LoginScreen');
const RegisterScreen = require('./screens/RegisterScreen');
const HomeScreen = require('./screens/HomeScreen');
const AccountScreen = require('./screens/AccountScreen');
const ContactsScreen = require('./screens/ContactsScreen');
const ChatScreen = require('./screens/ChatScreen');
const SettingsScreen = require('./screens/SettingsScreen');
const ProfileScreen = require('./screens/ProfileScreen');
const PhotoBrowserScene = require('./screens/PhotoBrowserScene');

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
    }
  },
  Register: {
    screen: RegisterScreen,
    navigationOptions: {
      headerTitle: '注册',
    }
  },
  Main: {
    screen: MainNavigator,
    navigationOptions: {
      headerLeft: null,
      title: 'TRPG Game',
    }
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
    navigationOptions: ({navigation}) => ({
      headerTitle: '与 ' + navigation.state.params.name + ' 的聊天',
    }),
  },
  Profile: {
    screen: ProfileScreen,
    navigationOptions: ({navigation}) => ({
      headerTitle: navigation.state.params.name + ' 的个人信息',
    }),
  },
  PhotoBrowser: {
    screen: PhotoBrowserScene,
  },
});
// // 重写goback(有性能问题)
// const defaultGetStateForAction = AppNavigator.router.getStateForAction;
// AppNavigator.router.getStateForAction = (action, state) => {
//   // goBack返回指定页面
//   if (state && action.type === 'Navigation/BACK' && action.key) {
//     const backRoute = state.routes.find((route) => route.routeName === action.key);
//     if (backRoute) {
//       const backRouteIndex = state.routes.indexOf(backRoute);
//       const purposeState = {
//         ...state,
//         routes: state.routes.slice(0, backRouteIndex + 1),
//         index: backRouteIndex,
//       };
//       return purposeState;
//     }
//   }
//   return defaultGetStateForAction(action, state)
// };

// redux state
// const AppWithNavigationState = ({dispatch, nav}) => (
//   <AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav })} />
// )
class AppWithNavigationState extends React.Component {
  constructor(props) {
    super(props);
    this.navigationPropConstructor = createNavigationPropConstructor("root");
  }

  componentDidMount() {
    initializeListeners("root", this.props.nav);
    if(Platform.OS === 'android') {
      BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
    }
  }

  componentWillUnmount() {
    if(Platform.OS === 'android') {
      BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
    }
  }

  onBackPress = () => {
    const { dispatch, nav } = this.props;
    if (nav.index !== 0) {
      dispatch(NavigationActions.back());
      return true;
    } else {
      // 到达主页
      if(this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
        // 最近两秒内按过back 可以退出应用
        return false;
      }

      this.lastBackPressed = Date.now();
      ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);
      return true;
    }
  }

  render() {
    const {dispatch, nav} = this.props;
    const navigation = this.navigationPropConstructor(dispatch, nav);
    return (
      <AppNavigator navigation={navigation} />
    )
  }
}

AppWithNavigationState.propTypes = {
  dispatch: PropTypes.func.isRequired,
  nav: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  return {
    nav: state.get('nav'),
  }
};

module.exports = {
  MainNavigator,
  AppNavigator,
  AppWithNavigationState: connect(mapStateToProps)(AppWithNavigationState),
}
