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
const { StackNavigator, TabNavigator, addNavigationHelpers } = require('react-navigation');
const HomeScreen = require('./screens/HomeScreen');
const AccountScreen = require('./screens/AccountScreen');

const MainNavigator = TabNavigator({
  TRPG: {
    screen: HomeScreen,
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

const AppNavigator = StackNavigator({
  Main: {
    screen: MainNavigator,
    navigationOptions: {
      headerTitle: 'TRPG Game',
    },
  },
  Details: {
    screen: DetailsScreen,
    navigationOptions: {
      headerTitle: 'Details',
    },
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
  console.log('state', state.get('nav'));
  return {
    nav: state.get('nav'),
  }
};

module.exports = {
  MainNavigator,
  AppNavigator,
  AppWithNavigationState: connect(mapStateToProps)(AppWithNavigationState),
}
