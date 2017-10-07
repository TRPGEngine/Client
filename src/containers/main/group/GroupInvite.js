const React = require('react');
const { connect } = require('react-redux');

require('./GroupInvite.scss')

class GroupInvite extends React.Component {
  render() {
    return (
      <div className="group-invite">
        <div className="friend-list">
          <div className="item">
            <div className="avatar">
              <img src="/src/assets/img/gugugu1.png" />
            </div>
            <div className="mask"></div>
          </div>
          <div className="item active">
            <div className="avatar">
              <img src="/src/assets/img/gugugu1.png" />
            </div>
            <div className="mask"></div>
          </div>
        </div>
        <i className="iconfont">&#xe606;</i>
        <div className="invite-list"></div>
        <button>发送邀请</button>
      </div>
    )
  }
}

module.exports = connect()(GroupInvite);
