const React = require('react');
const { connect } = require('react-redux');
const config = require('../../../../../config/project.config.js');
const dateHelper = require('../../../../utils/dateHelper');
const MsgSendBox = require('../../../components/MsgSendBox');
const MsgItem = require('../../../components/MsgItem');
const scrollTo = require('../../../../utils/animatedScrollTo.js');
const ReactTooltip = require('react-tooltip');
const { showModal, hideModal } = require('../../../../redux/actions/ui');
const { sendMsg, getMoreChatLog } = require('../../../../redux/actions/chat');
const { sendDiceRequest, sendDiceInvite } = require('../../../../redux/actions/dice');
const DiceRequest = require('../dice/DiceRequest');
const DiceInvite = require('../dice/DiceInvite');
const MsgContainer = require('../../../components/MsgContainer');

require('./ConverseDetail.scss');

class ConverseDetail extends React.Component {
  constructor(props) {
    super(props);
  }

  _handleSendMsg(message, type) {
    console.log('send msg:', message, 'to', this.props.converseUserUUID, 'in converse', this.props.converseUUID);
    this.props.dispatch(sendMsg(this.props.converseUUID, this.props.converseUserUUID, {
      message,
      is_public: false,
      is_group: false,
      type,
    }));
  }

  _handleSendDiceInv() {
    console.log("发送投骰邀请");
    let uuid = this.props.conversesUUID;
    let usercache = this.props.usercache;
    let name = usercache.getIn([uuid, 'nickname']) || usercache.getIn([uuid, 'username']);
    this.props.dispatch(showModal(
      <DiceInvite
        inviteList={[name]}
        onSendDiceInvite={(diceReason, diceExp) => {
          console.log("diceReason, diceExp",diceReason, diceExp);
          this.props.dispatch(sendDiceInvite(uuid, false, diceExp, diceReason, [uuid], [name]));
          this.props.dispatch(hideModal());
        }}
      />
    ))
  }

  render() {
    return (
      <div className="conv-detail">
        <MsgContainer className="conv-container" converseUUID={this.props.converseUUID} converseUserUUID={this.props.converseUserUUID} />
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
    let converseUUID = state.getIn(['chat', 'selectedConversesUUID']);
    return {
      userUUID: state.getIn(['user','info','uuid']),
      selfInfo: state.getIn(['user', 'info']),
      usercache: state.getIn(['cache', 'user']),
      converseUUID,
      converseUserUUID: state.getIn(['chat', 'selectedConversesUserUUID']),
    }
  }
)(ConverseDetail);
