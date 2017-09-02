const React = require('react');
const PropTypes = require('prop-types');
const { connect } = require('react-redux');
const { hideInfoCard } = require('../redux/actions/ui');
const { createConverse } = require('../redux/actions/chat');
const { addFriend } = require('../redux/actions/user');
require('./InfoCard.scss');

class InfoCard extends React.Component {
  getActions(uuid) {
    let friendList = this.props.friendList.toJS();
    let selfUUID = this.props.selfUUID;
    let disabledAddFriend = friendList.indexOf(uuid)>=0 || uuid===selfUUID;
    return (
      <div className="actions">
        <div
          className="footer-item"
          onClick={() => this.props.dispatch(createConverse(uuid, 'user'))}
        ><i className="iconfont">&#xe61f;</i>发消息</div>
        <div
          className={"footer-item" + (disabledAddFriend?" disabled":"")}
          onClick={() => {if(!disabledAddFriend) {this.props.dispatch(addFriend(uuid))} }}
        ><i className="iconfont">&#xe604;</i>添加好友</div>
      </div>
    )
  }

  render() {
    let uuid = this.props.uuid;
    let info = this.props.usercache.get(uuid);

    let body = '';
    if(this.props.show && info) {
      info = info.toJS();
      body = (
        <div className="mask">
          <div className="card">
            <div className="header">
              <div className="profile">
                <div className="avatar">
                  <img src={info.avatar || '/src/assets/img/gugugu1.png'} />
                </div>
                <span>{info.nickname || info.username}</span>
              </div>
              <div className="close" onClick={() => this.props.dispatch(hideInfoCard())}>
                <i className="iconfont">&#xe70c;</i>
              </div>
            </div>
            <div className="body">
              <div className="item">
                <span>唯一标识符:</span><span>{info.uuid}</span>
              </div>
            </div>
            <div className="footer">
              {this.getActions(info.uuid)}
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="info-card">
        {body}
      </div>
    )
  }
}

InfoCard.propTypes = {
  show: PropTypes.bool
}

module.exports = connect(
  state => ({
    usercache: state.getIn(['cache', 'user']),
    friendList: state.getIn(['user', 'friendList']),
    selfUUID: state.getIn(['user', 'info', 'uuid']),
  })
)(InfoCard);
