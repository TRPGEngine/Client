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
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
  }

  onBackPress = () => {
    const { dispatch, nav } = this.props;
    if (nav.index === 0) {
      return false;
    }

    dispatch(NavigationActions.back());
    return true;
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
