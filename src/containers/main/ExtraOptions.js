const React = require('react');
const ReactTooltip = require('react-tooltip');
const { connect } = require('react-redux');
const config = require('../../../config/project.config');
const { logout } = require('../../redux/actions/user');
const { showModal, switchMenuPannel } = require('../../redux/actions/ui');
const { setEditedTemplate } = require('../../redux/actions/actor');
const { addNote } = require('../../redux/actions/note');
const TemplateSelect = require('./actors/TemplateSelect');
const TemplateEdit = require('./actors/TemplateEdit');
const IsDeveloping = require('../../components/IsDeveloping');
const ChangePassword = require('../../components/ChangePassword');
const FriendsAdd = require('../../components/modal/FriendsAdd');

require('./ExtraOptions.scss');

class ExtraOptions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: ''
    }
    this.hideMenu = () => {
      document.removeEventListener('click', this.hideMenu);
      this.setState({show: ''});
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.hideMenu);
  }

  _handleClick(type) {
    let show = this.state.show;
    if(show !== type) {
      this.setState({show: type});
    }else {
      this.setState({show: ''});
    }
    document.addEventListener('click', this.hideMenu);
  }

  _handleClickMenu(menu) {
    if(menu === 'actorCreate') {
      this.props.dispatch(showModal(
        <TemplateSelect />
      ));
    }else if(menu === 'templateCreate') {
      this.props.dispatch(setEditedTemplate({}));
      this.props.dispatch(showModal(<TemplateEdit />));
    }else if(menu === 'noteCreate') {
      this.props.dispatch(switchMenuPannel(3));
      this.props.dispatch(addNote());
    }else if(menu === 'addFriend') {
      // this.props.dispatch(switchMenuPannel(2));
      this.props.dispatch(showModal(
        <FriendsAdd />
      ))
    }else if(menu === 'userSettings') {
      this.props.dispatch(showModal(
        <IsDeveloping />
      ));
    }else if(menu === 'systemSettings') {
      this.props.dispatch(showModal(
        <IsDeveloping />
      ));
    }else if(menu === 'changePassword') {
      this.props.dispatch(showModal(
        <ChangePassword />
      ));
    }else if(menu === 'help') {
      this.props.dispatch(showModal(
        <IsDeveloping />
      ));
    }else if(menu === 'blog') {
      window.open(config.url.blog);
    }else if(menu === 'logout') {
      this.props.dispatch(logout());
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
          <li onClick={() => this._handleClickMenu('userSettings')}>个人设置</li>
          <li onClick={() => this._handleClickMenu('systemSettings')}>系统设置</li>
          <li onClick={() => this._handleClickMenu('changePassword')}>修改密码</li>
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
