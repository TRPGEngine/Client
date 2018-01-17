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
} from 'react-native';
const { connect } = require('react-redux');
const { StackNavigator, TabNavigator, TabBarBottom, addNavigationHelpers } = require('react-navigation');
const LoginScreen = require('./screens/LoginScreen');
const HomeScreen = require('./screens/HomeScreen');
const AccountScreen = require('./screens/AccountScreen');
const ContactsScreen = require('./screens/ContactsScreen');
const ChatScreen = require('./screens/ChatScreen');

const MainNavigator = TabNavigator({
  TRPG: {
    screen: HomeScreen,
  },
  Contacts: {
    screen: ContactsScreen,
  },
  Account: {
    screen: AccountScreen,
  },
}, {
  headerTitle: 'TRPG Game',
  tabBarPosition: 'bottom',
  tabBarComponent: TabBarBottom,
});

const DetailsScreen = () => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>Details Screen</Text>
  </View>
);

const AppNavigator = StackNavigator({
  Login: {
    screen: LoginScreen,
  },
  Main: {
    screen: MainNavigator,
  },
  Details: {
    screen: DetailsScreen,
    navigationOptions: {
      headerTitle: 'Details',
    },
  },
  Chat: {
    screen: ChatScreen,
    navigationOptions: ({navigation}) => ({
      headerTitle: navigation.state.params.name || '',
    }),
  },
});

// redux state
const AppWithNavigationState = ({dispatch, nav}) => (
  <AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav })} />
)

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
