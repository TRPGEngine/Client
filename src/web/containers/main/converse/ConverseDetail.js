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
    this.props.dispatch(sendMsg(this.props.converseUserUUID, {
      message,
      is_public: false,
      is_group: false,
      type,
    }));
  }

  // 发送投骰请求
  _handleSendDiceReq() {
    this.props.dispatch(showModal(
      <DiceRequest
        onSendDiceRequest={(diceReason, diceExp) => {
          this.props.dispatch(sendDiceRequest(this.props.converseUserUUID, false, diceExp, diceReason));
          this.props.dispatch(hideModal());
        }}
      />
    ))
  }

  // 发送投骰邀请
  _handleSendDiceInv() {
    let uuid = this.props.conversesUUID;
    console.log("发送投骰邀请", uuid);
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

  getHeaderActions() {
    const actions = [
      {
        name: '个人信息',
        icon: '&#xe611;',
        component: (
          <div>test</div>
        )
      },
    ]

    return actions.map((item, index) => {
      return (
        <button
          key={"group-action-"+index}
          data-tip={item.name}
          onClick={(e) => {
            e.stopPropagation();
            alert('TODO');
          }}
        >
          <i className="iconfont" dangerouslySetInnerHTML={{__html: item.icon}}></i>
        </button>
      )
    })
  }

  render() {
    const userUUID = this.props.converseUserUUID;
    const usercache = this.props.usercache;
    let name = usercache.getIn([userUUID, 'nickname']) || usercache.getIn([userUUID, 'username']);
    let avatar = usercache.getIn([userUUID, 'avatar']) || config.defaultImg.user;
    return (
      <div className="conv-detail">
        <div className="conv-header">
          <div className="avatar">
            <img src={avatar} />
          </div>
          <div className="title">
            <div className="main-title">{name}</div>
          </div>
          <div className="actions">
            {this.getHeaderActions()}
          </div>
        </div>
        <MsgContainer className="conv-container" converseUUID={this.props.converseUUID} converseUserUUID={userUUID}  isGroup={false} />
        <MsgSendBox
          conversesUUID={this.props.conversesUUID}
          isGroup={false}
          onSendMsg={(message, type) => this._handleSendMsg(message, type)}
          onSendDiceReq={() => this._handleSendDiceReq()}
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
