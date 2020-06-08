import React from 'react';
import {
  Text,
  View,
  BackHandler,
  ToastAndroid,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { uiHandlerCollection } from './utils/ui-state-handler';
import _get from 'lodash/get';
import _toPairs from 'lodash/toPairs';
import _noop from 'lodash/noop';
import {
  NavigationContainer,
  RouteConfig,
  useNavigation,
  NavigationProp,
} from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationOptions,
  CardStyleInterpolators,
  StackScreenProps,
} from '@react-navigation/stack';
import {
  createBottomTabNavigator,
  BottomTabNavigationOptions,
} from '@react-navigation/bottom-tabs';
import { TMemo } from '@shared/components/TMemo';
import { TRPGStackParamList, TRPGTabParamList } from './types/params';
import { TIcon } from './components/TComponent';

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
import VersionScreen from './screens/about/VersionScreen';
import CreateGroupScreen from './screens/CreateGroupScreen';
import GroupDataScreen from './screens/GroupDataScreen';
import UserSelectScreen from './screens/UserSelectScreen';
import DebugScreen from './screens/DebugScreen';
import DocumentScreen from './screens/DocumentScreen';
import GroupMemberScreen from './screens/GroupMemberScreen';
import { AboutScreen } from './screens/about/AboutScreen';
import { GroupRuleScreen } from './screens/GroupRule';

interface RouterMap<ScreenOptions extends object = any> {
  [screenName: string]: {
    screen: React.ComponentType<any>;
    navigationOptions?: RouteConfig<
      any,
      any,
      any,
      ScreenOptions,
      any
    >['options'];
  };
}

///////////////////////
//// TRPG Tab
///////////////////////
export type TRPGTabScreenProps<
  RouteName extends keyof TRPGTabParamList
> = StackScreenProps<TRPGTabParamList, RouteName>;
export const useTRPGTabNavigation = () =>
  useNavigation<NavigationProp<TRPGTabParamList>>();
const Tab = createBottomTabNavigator();
const tabRoutes: RouterMap<BottomTabNavigationOptions> = {
  TRPG: {
    screen: HomeScreen,
    navigationOptions: {
      tabBarLabel: 'TRPG',
      tabBarIcon: ({ color }) => (
        <Text style={{ fontFamily: 'iconfont', fontSize: 26, color }}>
          &#xe648;
        </Text>
      ),
    },
  },
  Contacts: {
    screen: ContactsScreen,
    navigationOptions: {
      tabBarLabel: '通讯录',
      tabBarIcon: ({ color }) => (
        <Text style={{ fontFamily: 'iconfont', fontSize: 26, color }}>
          &#xe958;
        </Text>
      ),
    },
  },
  Account: {
    screen: AccountScreen,
    navigationOptions: {
      tabBarLabel: '我',
      tabBarIcon: ({ color }) => (
        <Text style={{ fontFamily: 'iconfont', fontSize: 26, color }}>
          &#xe60d;
        </Text>
      ),
    },
  },
};

const MainNavigatorContainer: React.FC = TMemo(() => {
  return (
    <Tab.Navigator>
      {_toPairs(tabRoutes).map(([name, info]) => {
        const options = info.navigationOptions;

        return (
          <Stack.Screen
            key={name}
            name={name as any}
            component={info.screen}
            options={options}
          />
        );
      })}
    </Tab.Navigator>
  );
});
MainNavigatorContainer.displayName = 'MainNavigatorContainer';

///////////////////////
//// TRPG Stack
///////////////////////
export type TRPGStackScreenProps<
  RouteName extends keyof TRPGStackParamList
> = StackScreenProps<TRPGStackParamList, RouteName>;
export const useTRPGStackNavigation = () =>
  useNavigation<NavigationProp<TRPGStackParamList>>();
const Stack = createStackNavigator<TRPGStackParamList>();
const stackRoutes: RouterMap<StackNavigationOptions> = {
  LaunchScreen: {
    screen: LaunchScreen,
    navigationOptions: {
      header: () => null,
    },
  },
  Login: {
    screen: LoginScreen,
    navigationOptions: {
      header: () => null,
    },
  },
  Register: {
    screen: RegisterScreen,
    navigationOptions: {
      headerTitle: '注册TRPG Game账户',
    },
  },
  Main: {
    screen: MainNavigatorContainer,
    navigationOptions: {
      headerLeft: () => null,
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
  About: {
    screen: AboutScreen,
    navigationOptions: {
      headerTitle: '关于TRPG Engine',
    },
  },
  Chat: {
    screen: ChatScreen,
    navigationOptions: (props) => {
      const navigation = props.navigation;
      const { state, getParam, setParams } = navigation;
      const { params } = state;
      const type = getParam('type');
      const isWriting = getParam('isWriting', false);
      return {
        headerTitle: isWriting ? '正在输入...' : `与 ${params.name} 的聊天`,
        headerRight: () =>
          ['user', 'group'].includes(type) ? (
            <View style={{ marginRight: 10 }}>
              <TIcon
                icon="&#xe607;"
                style={{ fontSize: 26 } as any}
                onPress={() =>
                  params.headerRightFunc && params.headerRightFunc()
                }
              />
            </View>
          ) : null,
        gestureEnabled: true,
      };
    },
  },
  AddFriend: {
    screen: AddFriendScreen,
    navigationOptions: (props) => ({
      headerTitle: '添加联系人',
      headerRight: () => (
        <View style={{ marginRight: 10 }}>
          <TouchableOpacity
            onPress={() => props.navigation.push('CreateGroup')}
          >
            <Text>建团</Text>
          </TouchableOpacity>
        </View>
      ),
    }),
  },
  Profile: {
    screen: ProfileScreen,
    navigationOptions: ({ navigation }) => ({
      headerTitle: navigation.state.params.name + ' 的个人信息',
      gestureEnabled: true,
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
  GroupRule: {
    screen: GroupRuleScreen,
    navigationOptions: {
      headerTitle: '团规则',
    },
  },
  GroupMember: {
    screen: GroupMemberScreen,
    navigationOptions: {
      headerTitle: '团成员',
    },
  },
  UserSelect: {
    screen: UserSelectScreen,
    navigationOptions: (props) => {
      const uuids = props.navigation.getParam('uuids', []);
      const selectedUUIDs = props.navigation.getParam('selectedUUIDs', []);
      const onSelected = props.navigation.getParam('onSelected', _noop);

      return {
        headerTitle:
          selectedUUIDs.length > 0
            ? `已选择 ${selectedUUIDs.length} / ${uuids.length}`
            : props.navigation.getParam('title', '选择用户'),
        headerRight: () => (
          <View style={{ marginRight: 10 }}>
            <TouchableOpacity
              onPress={() => {
                onSelected(selectedUUIDs);
                props.navigation.back();
              }}
            >
              <Text>完成</Text>
            </TouchableOpacity>
          </View>
        ),
      };
    },
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
  Document: {
    screen: DocumentScreen,
    navigationOptions: {
      headerTitle: '资料库',
    },
  },
  Webview: {
    screen: WebviewScreen,
    navigationOptions: ({ route, navigation }) => {
      const url = (route as any).params?.url;

      return {
        headerTitle: navigation.getParam('title', '加载中...'),
        headerRight: () => (
          <View style={{ marginRight: 10 }}>
            <TIcon
              icon="&#xe63c;"
              style={{ fontSize: 26 }}
              onPress={async () => {
                if (await Linking.canOpenURL(url)) {
                  Linking.openURL(url);
                }
              }}
            />
          </View>
        ),
      };
    },
  },
};

// ================== TODO ==================
// transitionConfig: () => ({
//   screenInterpolator: StackViewStyleInterpolator.forHorizontal,
// }),

// export const middleware = createReactNavigationReduxMiddleware(
//   (state: any) => state.nav,
//   'root'
// );

// const App = createReduxContainer(AppNavigator, 'root');

// interface ReduxNavigationProps extends DispatchProp<any> {
//   ui: any;
//   state: any;
// }
// class ReduxNavigation extends React.Component<ReduxNavigationProps> {
//   lastBackPressed: any;

//   componentDidMount() {
//     BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
//   }

//   componentWillUnmount() {
//     BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
//   }

//   componentDidUpdate(prevProps) {
//     this.handleUIChange(prevProps.ui, this.props.ui);
//   }

//   // 处理UI的状态
//   handleUIChange(prevUI, currentUI) {
//     const dispatch = this.props.dispatch;
//     const args: [any, any, any] = [prevUI, currentUI, dispatch];

//     uiHandlerCollection.forEach((handle) => handle(...args));
//   }

//   onBackPress = () => {
//     const { dispatch, state } = this.props;

//     if (state.index !== 0) {
//       dispatch(NavigationActions.back());
//       return true;
//     } else {
//       // 到达主页
//       if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
//         // 最近两秒内按过back 可以退出应用
//         return false;
//       }

//       this.lastBackPressed = Date.now();
//       ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);
//       return true;
//     }
//   };

//   render() {
//     const { dispatch, state } = this.props;
//     return <App dispatch={dispatch} state={state} />;
//   }
// }

// const mapStateToProps = (state) => {
//   return {
//     state: state.nav,
//     ui: state.ui,
//   };
// };

// export const AppWithNavigationState = connect(mapStateToProps)(ReduxNavigation);

export const AppRouter: React.FC = TMemo(() => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="LaunchScreen"
        screenOptions={{
          gestureEnabled: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
        mode="card"
      >
        {_toPairs(stackRoutes).map(([name, info]) => {
          const options = info.navigationOptions;

          return (
            <Stack.Screen
              key={name}
              name={name as any}
              component={info.screen}
              options={options}
            />
          );
        })}
      </Stack.Navigator>
    </NavigationContainer>
  );
});
AppRouter.displayName = 'AppRouter';
