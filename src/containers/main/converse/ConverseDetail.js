const React = require('react');
const { connect } = require('react-redux');
const config = require('../../../../config/project.config.js');
const dateHelper = require('../../../utils/dateHelper');
const MsgSendBox = require('../../../components/MsgSendBox');
const MsgItem = require('../../../components/MsgItem');
const scrollTo = require('../../../utils/animatedScrollTo.js');
const ReactTooltip = require('react-tooltip');
const { showModal, hideModal } = require('../../../redux/actions/ui');
const { sendMsg, getMoreChatLog } = require('../../../redux/actions/chat');
const { sendDiceRequest } = require('../../../redux/actions/dice');
const DiceRequest = require('../dice/DiceRequest');
const MsgContainer = require('../../../components/MsgContainer');

require('./ConverseDetail.scss');

class ConverseDetail extends React.Component {
  constructor(props) {
    super(props);
  }

  _handleSendMsg(message, type) {
    console.log('send msg:', message, 'to', this.props.converseUUID);
    this.props.dispatch(sendMsg(this.props.converseUUID ,{
      message,
      is_public: false,
      type,
    }));
  }

  _handleSendDiceInv() {
    // TODO
    console.log("发送投骰邀请");
  }

  render() {
    return (
      <div className="conv-detail">
        <MsgContainer className="conv-container" converseUUID={this.props.conversesUUID} />
        <MsgSendBox
          conversesUUID={this.props.conversesUUID}
          isGroup={false}
          onSendMsg={(message, type) => this._handleSendMsg(message, type)}
          onSendDiceInv={() => this._handleSendDiceInv()}
        />
      </div>
    )
  }
}

module.exports = connect(
  state => {
    let conversesUUID = state.getIn(['chat', 'selectedConversesUUID']);
    return {
      userUUID: state.getIn(['user','info','uuid']),
      selfInfo: state.getIn(['user', 'info']),
      usercache: state.getIn(['cache', 'user']),
      conversesUUID,
    }
  }
)(ConverseDetail);
