import { TRPGStackParamList, TRPGTabParamList } from './params';
import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

export type TRPGTabNavigation<
  RouteName extends keyof TRPGTabParamList
> = BottomTabNavigationProp<TRPGTabParamList, RouteName>;

export type TRPGStackNavigation<
  RouteName extends keyof TRPGStackParamList
> = StackNavigationProp<TRPGStackParamList, RouteName>;
