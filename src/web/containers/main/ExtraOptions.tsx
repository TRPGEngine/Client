import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import config from '@src/shared/project.config';
import { logout, loginWithToken } from '@src/shared/redux/actions/user';
import { showModal, switchMenuPannel } from '@shared/redux/actions/ui';
import { addNote } from '@shared/redux/actions/note';
import ActorCreate from '@web/components/modal/ActorCreate';
// import IsDeveloping from '../../components/IsDeveloping';
import GroupCreate from '@web/components/modal/GroupCreate';
import ChangePassword from '@web/components/ChangePassword';
import FriendsAdd from '@web/components/modal/FriendsAdd';
import GroupAdd from '@web/components/modal/GroupAdd';
import UserSettings from '@web/components/modal/UserSettings';
import SystemSettings from '@web/components/modal/SystemSettings';
import SystemStatus from '@web/components/modal/SystemStatus';
import ModalPanel from '@web/components/ModalPanel';
import Webview from '@web/components/Webview';
import rnStorage from '@shared/api/rn-storage.api';

import './ExtraOptions.scss';
import { showPortal } from '@web/redux/action/ui';
import DevContainer from '@web/components/DevContainer';
import { PortalView } from '@web/components/PortalView';
import { UserSelector } from '@web/components/modal/UserSelector';

interface Props extends DispatchProp<any> {}
class ExtraOptions extends React.Component<Props> {
  state = {
    show: '',
  };

  hideMenu = () => {
    document.removeEventListener('click', this.hideMenu);
    this.setState({ show: '' });
  };

  componentWillUnmount() {
    document.removeEventListener('click', this.hideMenu);
  }

  handleClick(type) {
    let show = this.state.show;
    if (show !== type) {
      this.setState({ show: type });
    } else {
      this.setState({ show: '' });
    }
    document.addEventListener('click', this.hideMenu);
  }

  handleClickMenu(menu: string) {
    if (menu === 'actorCreate') {
      this.props.dispatch(showModal(<ActorCreate />));
      // } else if (menu === 'templateCreate') {
      //   this.props.dispatch(setEditedTemplate({}));
      //   this.props.dispatch(showModal(<TemplateEdit isEdit={false} />));
    } else if (menu === 'noteCreate') {
      this.props.dispatch(switchMenuPannel(3));
      this.props.dispatch(addNote());
    } else if (menu === 'groupCreate') {
      this.props.dispatch(showModal(<GroupCreate />));
    } else if (menu === 'addFriend') {
      this.props.dispatch(showModal(<FriendsAdd />));
    } else if (menu === 'addGroup') {
      this.props.dispatch(showModal(<GroupAdd />));
    } else if (menu === 'userSettings') {
      this.props.dispatch(showModal(<UserSettings />));
    } else if (menu === 'systemSettings') {
      this.props.dispatch(showModal(<SystemSettings />));
    } else if (menu === 'systemStatus') {
      this.props.dispatch(showModal(<SystemStatus />));
    } else if (menu === 'changePassword') {
      this.props.dispatch(showModal(<ChangePassword />));
    } else if (menu === 'relogin') {
      (async () => {
        let uuid = await rnStorage.get('uuid');
        let token = await rnStorage.get('token');
        console.log('正在尝试自动重新登录');
        this.props.dispatch(loginWithToken(uuid, token));
      })();
    } else if (menu === 'help') {
      this.props.dispatch(
        showModal(
          <ModalPanel title="帮助反馈" className="help">
            <PortalView url="/help/feedback" />
          </ModalPanel>
        )
      );
    } else if (menu === 'disclaimer') {
      this.props.dispatch(
        showPortal('/about/disclaimer', 'standalonewindow', {
          title: '免责声明',
        })
      );
    } else if (menu === 'blog') {
      window.open(config.url.blog);
    } else if (menu === 'logout') {
      this.props.dispatch(logout());
    }

    // test function below
    if (menu === 'portalCreateActor') {
      this.props.dispatch(showPortal('/actor/list'));
    } else if (menu === 'createTestWindow') {
      import('@web/components/StandaloneWindow').then((module) =>
        module.default.open({
          body: 'test',
        })
      );
    } else if (menu === 'userSelector') {
      this.props.dispatch(showModal(<UserSelector />));
    }

    this.setState({ show: '' });
  }

  _getContent() {
    const type = this.state.show;

    if (type === 'add') {
      return (
        <ul>
          <li onClick={() => this.handleClickMenu('actorCreate')}>创建人物</li>
          <DevContainer>
            <li onClick={() => this.handleClickMenu('portalCreateActor')}>
              创建人物(测试)
            </li>
            <li onClick={() => this.handleClickMenu('createTestWindow')}>
              新建窗口(测试)
            </li>
            <li onClick={() => this.handleClickMenu('userSelector')}>
              选择人物(测试)
            </li>
          </DevContainer>
          {/* <li onClick={() => this.handleClickMenu('templateCreate')}>
            创建模板
          </li> */}
          <li onClick={() => this.handleClickMenu('groupCreate')}>创建团</li>
          <li onClick={() => this.handleClickMenu('noteCreate')}>添加笔记</li>
          <li onClick={() => this.handleClickMenu('addFriend')}>添加好友</li>
          <li onClick={() => this.handleClickMenu('addGroup')}>添加团</li>
        </ul>
      );
    } else if (type === 'more') {
      return (
        <ul>
          <li onClick={() => this.handleClickMenu('userSettings')}>个人设置</li>
          <li onClick={() => this.handleClickMenu('systemSettings')}>
            系统设置
          </li>
          <li onClick={() => this.handleClickMenu('systemStatus')}>系统状态</li>
          <li onClick={() => this.handleClickMenu('changePassword')}>
            修改密码
          </li>
          {config.environment === 'development' ? (
            <li onClick={() => this.handleClickMenu('relogin')}>重新登录</li>
          ) : null}
          <li onClick={() => this.handleClickMenu('help')}>帮助反馈</li>
          <li onClick={() => this.handleClickMenu('disclaimer')}>免责声明</li>
          <li onClick={() => this.handleClickMenu('blog')}>开发者博客</li>
          <li onClick={() => this.handleClickMenu('logout')}>退出登录</li>
        </ul>
      );
    } else {
      return '';
    }
  }

  render() {
    return (
      <div className="extra-options">
        <div
          className={
            'extra-menu ' + this.state.show + (this.state.show ? ' active' : '')
          }
        >
          {this._getContent()}
        </div>
        <div className="extra-item" onClick={() => this.handleClick('add')}>
          <i className="iconfont">&#xe64b;</i>
        </div>
        <div className="extra-item" onClick={() => this.handleClick('more')}>
          <i className="iconfont">&#xe600;</i>
        </div>
      </div>
    );
  }
}

export default connect()(ExtraOptions);
