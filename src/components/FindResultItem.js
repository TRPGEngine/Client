const React = require('react');
const { connect } = require('react-redux');

require('./FindResultItem.scss');

class FindResultItem extends React.Component {
  _handleAddFriend(uuid) {
    console.log("add friend:", uuid);
  }

  render() {
    let info = this.props.info;
    return (
      <div className="find-result-item">
        <div className="avatar">
          <img src={info.avatar || '/src/assets/img/gugugu1.png'} />
        </div>
        <div className="profile">
          <span className="username">{info.nickname || info.username}</span>
          <span className="uuid">{info.uuid}</span>
        </div>
        <div className="action">
          <button onClick={() => this._handleAddFriend(info.uuid)}>
            <i className="iconfont">&#xe604;</i>添加好友
          </button>
        </div>
      </div>
    )
  }
}

module.exports = FindResultItem;
