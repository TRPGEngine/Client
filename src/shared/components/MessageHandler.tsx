import React from 'react';
import { MsgType, MsgPayload } from '@redux/types/chat';

export interface MessageProps {
  type: MsgType;
  me: boolean;
  name: string;
  avatar: string;
  info: MsgPayload;
  emphasizeTime: boolean;
}
class MessageHandler extends React.Component<MessageProps> {
  static messageHandlers = {};

  static registerMessageHandler(messageType, messageHandler) {
    if (typeof messageType !== 'string') {
      throw new Error('[registerMessageHandler] messageType mustbe a string');
    }
    if (!(messageHandler instanceof React.Component)) {
      throw new Error(
        '[registerMessageHandler] messageHandler mustbe a react componet'
      );
    }
    MessageHandler.messageHandlers[messageType] = messageHandler;
  }

  static registerDefaultMessageHandler(messageHandler) {
    MessageHandler.registerMessageHandler('default', messageHandler);
  }

  render() {
    let messageType = this.props.type;
    let Handler =
      MessageHandler.messageHandlers[messageType] ||
      MessageHandler.messageHandlers['default'];

    return <Handler {...this.props} />;
  }
}

export default MessageHandler;
