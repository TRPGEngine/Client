import React from 'react';
import { MsgType, RenderMsgPayload } from '@src/shared/redux/types/chat';

export interface MessageProps {
  type: MsgType;
  me: boolean;
  name: string;
  avatar: string;
  info: RenderMsgPayload;
  emphasizeTime: boolean;
}
class MessageHandler extends React.PureComponent<MessageProps> {
  static messageHandlers = {};

  static registerMessageHandler(
    messageType: string,
    messageHandler: typeof React.Component
  ) {
    if (typeof messageType !== 'string') {
      throw new Error('[registerMessageHandler] messageType mustbe a string');
    }

    MessageHandler.messageHandlers[messageType] = messageHandler;
  }

  static registerDefaultMessageHandler(messageHandler: typeof React.Component) {
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
