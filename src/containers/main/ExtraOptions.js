const React = require('react');
const ReactTooltip = require('react-tooltip');

require('./ExtraOptions.scss');

class ExtraOptions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: ''
    }
  }

  _handleClick(type) {
    let show = this.state.show;
    if(show !== type) {
      this.setState({show: type});
    }else {
      this.setState({show: ''});
    }
  }

  _getContent() {
    let type = this.state.show;
    if(type === 'add') {
      return (
        <ul>
          <li>内部群聊天</li>
          <li>发起聊天</li>
          <li>Ding</li>
          <li>添加好友</li>
        </ul>
      )
    }else if(type === 'more') {
      return (
        <ul>
          <li>个人设置</li>
          <li>系统设置</li>
          <li>修改密码</li>
          <li>帮助反馈</li>
          <li>退出登录</li>
        </ul>
      )
    }else {
      return '';
    }
  }

  render() {
    return (
      <div className="extra-options">
        <div className={"extra-menu " + this.state.show + (this.state.show?" active":"")}>
          {this._getContent()}
        </div>
        <div className="extra-item" onClick={() => this._handleClick('add')}>
          <i className="iconfont">&#xe64b;</i>
        </div>
        <div className="extra-item" onClick={() => this._handleClick('more')}>
          <i className="iconfont">&#xe600;</i>
        </div>
      </div>
    )
  }
}

module.exports = ExtraOptions;
