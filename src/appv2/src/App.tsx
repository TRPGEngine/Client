import React from 'react';
import { StatusBar, useWindowDimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { HomeScreen } from './screens/HomeScreen';
import { NavbarScreen } from './screens/NavbarScreen';
import { RightPanelScreen } from './screens/RightPanelScreen';

const Drawer = createDrawerNavigator();

const Main = () => {
  const dimensions = useWindowDimensions();

  return (
    <Drawer.Navigator
      drawerPosition="right"
      overlayColor="rgba(0,0,0,0)"
      drawerType="slide"
      edgeWidth={dimensions.width * 0.3}
      drawerStyle={{
        backgroundColor: '#c6cbef',
        width: dimensions.width * 0.7,
      }}
      drawerContent={() => <RightPanelScreen />}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
    </Drawer.Navigator>
  );
};

const App = () => {
  const dimensions = useWindowDimensions();

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <NavigationContainer>
        <Drawer.Navigator
          drawerPosition="left"
          openByDefault={true}
          overlayColor="rgba(0,0,0,0)"
          drawerType="slide"
          edgeWidth={dimensions.width * 0.3}
          drawerStyle={{
            backgroundColor: '#c6cbef',
            width: dimensions.width * 0.7,
          }}
          drawerContent={() => <NavbarScreen />}
        >
          <Drawer.Screen name="Main" component={Main} />
        </Drawer.Navigator>
      </NavigationContainer>
    </>
  );
};

export default App;
