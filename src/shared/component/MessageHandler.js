const React = require('react');

class MessageHandler extends React.Component {
  static messageHander = {}

  static registerMessageHander(messageType, messageHandler) {
    if(typeof messageType !== 'string') {
      throw new Error('[registerMessageHander] messageType mustbe a string');
    }
    if(typeof messageHander instanceof React.Component) {
      throw new Error('[registerMessageHander] messageHander mustbe a react componet');
    }
    MessageHandler.messageType[messageType] = messageHander;
  }

  static registerDefaultMessageHander(messageHandler) {
    MessageHandler.registerMessageHander('default', messageHandler);
  }

  render() {
    let messageType = this.props.type;
    let data = this.props.data;
    let messageHander = MessageHandler.messageHander[messageType] || MessageHandler.messageHander['default'];

    return (
      <messageHander data={data} />
    )
  }
}

module.exports = name;
