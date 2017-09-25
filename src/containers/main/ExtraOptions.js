const React = require('react');
const ReactTooltip = require('react-tooltip');
const { connect } = require('react-redux');
const { logout } = require('../../redux/actions/user');
const { showModal, switchMenu } = require('../../redux/actions/ui');
const { setEditedTemplate } = require('../../redux/actions/actor');
const { addNote } = require('../../redux/actions/note');
const ActorCreate = require('./actors/ActorCreate');
const TemplateEdit = require('./actors/TemplateEdit');

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

  _handleClickMenu(menu) {
    if(menu === 'logout') {
      this.props.dispatch(logout());
    }else if(menu === 'blog') {
      window.open("http://moonrailgun.com");
    }else if(menu === 'actorCreate') {
      this.props.dispatch(showModal(
        <ActorCreate />
      ));
    }else if(menu === 'templateCreate') {
      this.props.dispatch(setEditedTemplate({}));
      this.props.dispatch(showModal(<TemplateEdit />));
    }else if(menu === 'noteCreate') {
      this.props.dispatch(switchMenu(4));
      this.props.dispatch(addNote());
    }else if(menu === 'addFriend') {
      this.props.dispatch(switchMenu(2));
    }

    this.setState({show: ''});
  }

  _getContent() {
    let type = this.state.show;
    if(type === 'add') {
      return (
        <ul>
          <li onClick={() => this._handleClickMenu('actorCreate')}>创建人物</li>
          <li onClick={() => this._handleClickMenu('templateCreate')}>创建模板</li>
          <li onClick={() => this._handleClickMenu('noteCreate')}>添加笔记</li>
          <li onClick={() => this._handleClickMenu('addFriend')}>添加好友</li>
        </ul>
      )
    }else if(type === 'more') {
      return (
        <ul>
          <li>个人设置</li>
          <li>系统设置</li>
          <li>修改密码</li>
          <li onClick={() => this._handleClickMenu('help')}>帮助反馈</li>
          <li onClick={() => this._handleClickMenu('blog')}>开发者博客</li>
          <li onClick={() => this._handleClickMenu('logout')}>退出登录</li>
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

module.exports = connect()(ExtraOptions);
