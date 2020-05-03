import React, { Fragment } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { ChatType } from '@app/types/params';

interface Props {
  type: ChatType;
}

/**
 * 消息列表的上下文提供
 * 根据不同类型的会话类型进行区分
 */
export const ChatScreenProvider: React.FC<Props> = TMemo((props) => {
  return <Fragment>{props.children}</Fragment>;
});
ChatScreenProvider.displayName = 'ChatScreenProvider';
