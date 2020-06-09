import React from 'react';
import {
  NavigationContainerRef,
  NavigationAction,
} from '@react-navigation/native';

export const navigationRef = React.createRef<NavigationContainerRef>();

/**
 * 获取全局导航器
 */
export function getGlobalNavigation(): NavigationContainerRef | null {
  return navigationRef.current;
}
