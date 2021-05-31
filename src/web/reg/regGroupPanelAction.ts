/**
 * 注册群组面板的操作
 * 位置在右上角
 * 加载顺序为从右往左(先注册的在右边)
 */

import type React from 'react';
import { buildRegList } from '@shared/manager/buildRegList';

interface GroupPanelActionType {
  /**
   * 匹配群组面板的类型
   */
  type: string;

  /**
   * 操作render
   */
  action: React.ReactElement;
}

export const [groupPanelActionList, regGroupPanelAction] =
  buildRegList<GroupPanelActionType>();
