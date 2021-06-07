/**
 * 注册消息输入框的操作
 * 位置在
 * 加载顺序为从右往左(先注册的在右边)
 */

import type React from 'react';
import { buildRegList } from '@shared/manager/buildRegList';

/**
 * 左侧操作
 */
export const [chatSendBoxLeftAction, regChatSendBoxLeftAction] =
  buildRegList<React.ReactElement>();

/**
 * 右侧操作
 */
export const [chatSendBoxRightAction, regChatSendBoxRightAction] =
  buildRegList<React.ReactElement>();

/**
 * Addon操作
 */
export const [chatSendBoxAddonAction, regChatSendBoxAddonAction] =
  buildRegList<{
    label: string;
    onClick: (context: { converseUUID: string }) => void;
  }>();
