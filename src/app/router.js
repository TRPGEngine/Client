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

// class HomeScreen1 extends React.Component {
//   render() {
//     return (
//       <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//         <Text>Home Screen</Text>
//       </View>
//     );
//   }
// }

// const AppNavigator = createStackNavigator({
//   Home: {
//     screen: HomeScreen1
//   },
// });

// class App extends React.Component {
//   constructor(props) {
//     super(props);
//     this.navigationPropConstructor = createNavigationPropConstructor("root");
//   }

//   componentDidMount() {
//     if(Platform.OS === 'android') {
//       BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
//     }
//   }

//   componentWillUnmount() {
//     if(Platform.OS === 'android') {
//       BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
//     }
//   }

//   onBackPress = () => {
//     const { dispatch, nav } = this.props;
//     if (nav.index !== 0) {
//       dispatch(NavigationActions.back());
//       return true;
//     } else {
//       // 到达主页
//       if(this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
//         // 最近两秒内按过back 可以退出应用
//         return false;
//       }

//       this.lastBackPressed = Date.now();
//       ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);
//       return true;
//     }
//   }

//   render() {
//     const {dispatch, nav} = this.props;
//     const navigation = this.navigationPropConstructor(dispatch, nav);
//     return (
//       <AppNavigator navigation={navigation} />
//     )
//   }
// }

// App.propTypes = {
//   dispatch: PropTypes.func.isRequired,
//   nav: PropTypes.object.isRequired,
// };

const middleware = createReactNavigationReduxMiddleware(
  "root",
  state => state.get('nav'),
);

const App = reduxifyNavigator(AppNavigator, "root")

const mapStateToProps = state => {
  return {
    state: state.get('nav')
  }
};

module.exports = {
  middleware,
  MainNavigator,
  AppNavigator,
  AppWithNavigationState: connect(mapStateToProps)(App),
}
