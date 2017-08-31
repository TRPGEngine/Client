const React = require('react');
const { connect } = require('react-redux');

require('./FriendsDetail.scss');

class FriendsDetail extends React.Component {
  render() {
    return (
      <div className="friends-detail">
        <div className="friends-search">
          <input type="text" placeholder="请输入你要添加的好友信息" spellCheck="false" />
          <select>
            <option>UUID</option>
            <option>用户名</option>
          </select>
          <button>搜索</button>
        </div>
        <div className="friends-search-result">
          结果
        </div>
      </div>
    )
  }
}

module.exports = connect(
  state => ({

  })
)(FriendsDetail);
