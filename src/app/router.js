const React = require('react');
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
const { StackNavigator, TabNavigator } = require('react-navigation');
const HomeScreen = require('./screens/HomeScreen');
const AccountScreen = require('./screens/AccountScreen');

const MainScreen = TabNavigator({
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

const RootNavigator = StackNavigator({
  Main: {
    screen: MainScreen,
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

module.exports = {
  RootNavigator,
}
