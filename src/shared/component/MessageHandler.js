const React = require('react');

class MessageHandler extends React.Component {
  static messageHandlers = {}

  static registerMessageHander(messageType, messageHandler) {
    if(typeof messageType !== 'string') {
      throw new Error('[registerMessageHander] messageType mustbe a string');
    }
    if(typeof messageHandler instanceof React.Component) {
      throw new Error('[registerMessageHander] messageHandler mustbe a react componet');
    }
    MessageHandler.messageHandlers[messageType] = messageHandler;
  }

  static registerDefaultMessageHander(messageHandler) {
    MessageHandler.registerMessageHander('default', messageHandler);
  }

  render() {
    let messageType = this.props.type;
    let Handler = MessageHandler.messageHandlers[messageType] || MessageHandler.messageHandlers['default'];

    return (
      <Handler {...this.props} />
    )
  }
}

module.exports = MessageHandler;
