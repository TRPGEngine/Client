import React from 'react';

class MessageHandler extends React.Component {
  static messageHandlers = {};

  static registerMessageHandler(messageType, messageHandler) {
    if (typeof messageType !== 'string') {
      throw new Error('[registerMessageHandler] messageType mustbe a string');
    }
    if (typeof messageHandler instanceof React.Component) {
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
