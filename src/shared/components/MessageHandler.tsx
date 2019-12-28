import React, { Component } from 'react';
import { MsgType, MsgPayload } from '@src/shared/redux/types/chat';

export interface MessageProps {
  type: MsgType;
  me: boolean;
  name: string;
  avatar: string;
  info: MsgPayload;
  emphasizeTime: boolean;
}
class MessageHandler extends Component<MessageProps> {
  static messageHandlers = {};

  static registerMessageHandler(
    messageType: string,
    messageHandler: typeof Component
  ) {
    if (typeof messageType !== 'string') {
      throw new Error('[registerMessageHandler] messageType mustbe a string');
    }

    MessageHandler.messageHandlers[messageType] = messageHandler;
  }

  static registerDefaultMessageHandler(messageHandler: typeof Component) {
    MessageHandler.registerMessageHandler('default', messageHandler);
  }

  render() {
    const messageType = this.props.type;
    const Handler =
      MessageHandler.messageHandlers[messageType] ||
      MessageHandler.messageHandlers['default'];

    return <Handler {...this.props} />;
  }
}

export default MessageHandler;
