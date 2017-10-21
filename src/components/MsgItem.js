const React = require('react');
const PropTypes = require('prop-types');
const { connect } = require('react-redux');
const { agreeFriendInvite, refuseFriendInvite } = require('../redux/actions/user');
const { agreeGroupInvite, refuseGroupInvite } = require('../redux/actions/group');
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
          <div className="card-content">
            {data.get('content')}
          </div>
          {this.getCardAction(data)}
        </div>
      )
    }else {
      return (
        <div className="bubble">{this.props.content}</div>
      )
    }
  }

  render() {
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

MsgItem.propTypes = {
  icon: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  time: PropTypes.string,
  content: PropTypes.string,
  me: PropTypes.bool,
}

module.exports = connect()(MsgItem);
