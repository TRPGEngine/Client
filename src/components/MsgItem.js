const React = require('react');
const PropTypes = require('prop-types');
const { connect } = require('react-redux');
const { agreeFriendInvite, refuseFriendInvite } = require('../redux/actions/user');
const { agreeGroupInvite, refuseGroupInvite } = require('../redux/actions/group');
const { acceptDiceRequest } = require('../redux/actions/dice');
require('./MsgItem.scss');

class MsgItem extends React.Component {
  getCardAction(data) {
    let cardType = data.get('type');
    if(cardType === 'friendInvite') {
      let actionState = data.get('actionState');
      let uuid = data.getIn(['invite', 'uuid']);
      switch (actionState) {
        case 1:
          return (
            <div className="card-action">
              <button disabled>已同意</button>
            </div>
          )
        case 2:
          return (
            <div className="card-action">
              <button disabled>已拒绝</button>
            </div>
          )
        case 0:
        default:
          return (
            <div className="card-action">
              <button onClick={() => this.props.dispatch(refuseFriendInvite(uuid))}>拒绝</button>
              <button onClick={() => this.props.dispatch(agreeFriendInvite(uuid))}>同意</button>
            </div>
          )
      }
    }else if(cardType === 'groupInvite') {
      let actionState = data.get('actionState');
      let uuid = data.getIn(['invite', 'uuid']);
      switch (actionState) {
        case 1:
          return (
            <div className="card-action">
              <button disabled>已同意</button>
            </div>
          )
        case 2:
          return (
            <div className="card-action">
              <button disabled>已拒绝</button>
            </div>
          )
        case 0:
        default:
          return (
            <div className="card-action">
              <button onClick={() => this.props.dispatch(refuseGroupInvite(uuid))}>拒绝</button>
              <button onClick={() => this.props.dispatch(agreeGroupInvite(uuid))}>同意</button>
            </div>
          )
      }
    }else if(cardType === 'diceRequest') {
      let uuid = this.props.uuid;
      // TODO: 需要修改为只有有同意权限的人才会显示
      let is_accept = data.get('is_accept');
      let allow_accept_list = data.get('allow_accept_list');
      if(is_accept) {
        return (
          <div className="card-action">
            <button disabled={true}>已接受</button>
          </div>
        )
      }else {
        let canAccept = allow_accept_list.includes(this.props.selfUUID);

        return (
          <div className="card-action">
            {canAccept ? (
              <button onClick={() => this.props.dispatch(acceptDiceRequest(uuid))}>接受</button>
            ) : (
              <button disabled={true}>{this.props.me?'等待对方处理':'等待处理'}</button>
            )}
          </div>
        )
      }

    }else {
      return (
        <div className="card-action">
          <span className="no-support">您当前的版本暂时不支持处理该信息</span>
        </div>
      )
    }
  }

  getContent() {
    if(this.props.type === 'card') {
      let data = this.props.data || {};
      return (
        <div className="bubble">
          <div className="card-title">
            {data.get('title')}
          </div>
          <pre className="card-content">
            {data.get('content') || this.props.content}
          </pre>
          {this.getCardAction(data)}
        </div>
      )
    }else {
      return (
        <pre className="bubble">{this.props.content}</pre>
      )
    }
  }

  render() {
    if(this.props.type === 'tip') {
      return (
        <div className="msg-item-tip">
          <div className="content">{this.props.content}</div>
        </div>
      )
    }else {
      return (
        <div className={"msg-item "+(this.props.me?"me ":"") + this.props.type}>
          <div className="profile">
            <span className="name">{this.props.name}</span>
            <span className="time">{this.props.time}</span>
          </div>
          <div className="content">
            <div className="avatar"><img src={this.props.icon} /></div>
            <div className="body">
              {this.getContent()}
            </div>
          </div>
        </div>
      )
    }
  }
}

MsgItem.propTypes = {
  icon: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  time: PropTypes.string,
  content: PropTypes.string,
  me: PropTypes.bool,
  isGroupMsg: PropTypes.bool,
}

module.exports = connect(
  state => ({
    selfUUID: state.getIn(['user', 'info', 'uuid']),
  })
)(MsgItem);
