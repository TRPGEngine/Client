const React = require('react');
const PropTypes = require('prop-types');
const { connect } = require('react-redux');
const { hideProfileCard } = require('../redux/actions/ui');
const { addFriend } = require('../redux/actions/user');
require('./ProfileCard.scss');

class ProfileCard extends React.Component {
  getActions(uuid) {
    let friendList = this.props.friendList.toJS();
    let selfUUID = this.props.selfUUID;
    let disabledAddFriend = friendList.indexOf(uuid)>=0 || uuid===selfUUID;
    return (
      <div className="actions">
        <div
          className="footer-item"
          onClick={() => console.log('reset')}
        ><i className="iconfont">&#xe61f;</i>重置</div>
        <div
          className={"footer-item" + (disabledAddFriend?" disabled":"")}
          onClick={() => console.log('save')}
        ><i className="iconfont">&#xe604;</i>保存</div>
      </div>
    )
  }

  render() {
    let info = this.props.usercache.get(this.props.selfUUID);

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
              <div className="close" onClick={() => this.props.dispatch(hideProfileCard())}>
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
      <div className="profile-card">
        {body}
      </div>
    )
  }
}

ProfileCard.propTypes = {
  show: PropTypes.bool
}

module.exports = connect(
  state => ({
    usercache: state.getIn(['cache', 'user']),
    friendList: state.getIn(['user', 'friendList']),
    selfUUID: state.getIn(['user', 'info', 'uuid']),
  })
)(ProfileCard);
