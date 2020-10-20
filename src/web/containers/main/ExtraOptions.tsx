import React, { Fragment } from 'react';
import { connect, DispatchProp } from 'react-redux';
import config from '@src/shared/project.config';
import { logout, loginWithToken } from '@src/shared/redux/actions/user';
import { showModal, switchMenuPannel } from '@shared/redux/actions/ui';
import { addNote } from '@shared/redux/actions/note';
import ActorCreate from '@web/components/modals/ActorCreate';
// import IsDeveloping from '../../components/IsDeveloping';
import GroupCreateOld from '@web/components/modals/GroupCreateOld';
import ChangePassword from '@web/components/ChangePassword';
import FriendsAdd from '@web/components/modals/FriendsAdd';
import GroupAdd from '@web/components/modals/GroupAdd';
import UserSettingsModal from '@web/components/modals/UserSettings';
import SystemSettings from '@web/components/modals/SystemSettings';
import SystemStatus from '@web/components/modals/SystemStatus';
import ModalPanel from '@web/components/ModalPanel';
import rnStorage from '@shared/api/rn-storage.api';

import './ExtraOptions.scss';
import { showPortal } from '@web/redux/action/ui';
import DevContainer from '@web/components/DevContainer';
import { PortalView } from '@web/components/PortalView';
import { UserSelector } from '@web/components/modals/UserSelector';
import { switchToAppVersion } from '@web/utils/debug-helper';

interface ExtraActionItems {
  label: string;
  onClick: () => void;
  isDev?: boolean;
}

interface ExtraActions {
  [type: string]: ExtraActionItems[];
}

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
    const show = this.state.show;
    if (show !== type) {
      this.setState({ show: type });
    } else {
      this.setState({ show: '' });
    }
    document.addEventListener('click', this.hideMenu);
  }

  actions: ExtraActions = {
    add: [
      {
        label: '创建人物',
        onClick: () => {
          this.props.dispatch(showModal(<ActorCreate />));
        },
      },
      {
        label: '创建人物(测试)',
        isDev: true,
        onClick: () => {
          this.props.dispatch(showPortal('/actor/list'));
        },
      },
      {
        label: '新建窗口(测试)',
        isDev: true,
        onClick: () => {
          import('@web/components/StandaloneWindow').then((module) =>
            module.default.open!({
              body: 'test',
            })
          );
        },
      },
      {
        label: '选择人物(测试)',
        isDev: true,
        onClick: () => {
          this.props.dispatch(showModal(<UserSelector />));
        },
      },
      {
        label: '创建团',
        onClick: () => {
          this.props.dispatch(showModal(<GroupCreateOld />));
        },
      },
      {
        label: '添加笔记',
        onClick: () => {
          this.props.dispatch(switchMenuPannel(3));
          this.props.dispatch(addNote());
        },
      },
      {
        label: '添加好友',
        onClick: () => {
          this.props.dispatch(showModal(<FriendsAdd />));
        },
      },
      {
        label: '添加团',
        onClick: () => {
          this.props.dispatch(showModal(<GroupAdd />));
        },
      },
    ],
    more: [
      {
        label: '个人设置',
        onClick: () => {
          this.props.dispatch(showModal(<UserSettingsModal />));
        },
      },
      {
        label: '系统设置',
        onClick: () => {
          this.props.dispatch(showModal(<SystemSettings />));
        },
      },
      {
        label: '系统状态',
        onClick: () => {
          this.props.dispatch(showModal(<SystemStatus />));
        },
      },
      {
        label: '切换到新版UI',
        onClick: () => {
          switchToAppVersion(true);
        },
      },
      {
        label: '修改密码',
        onClick: () => {
          this.props.dispatch(showModal(<ChangePassword />));
        },
      },
      {
        label: '跑团战报',
        onClick: () => {
          this.props.dispatch(
            showPortal('/trpg/report/list', 'standalonewindow', {
              title: '跑团战报',
            })
          );
        },
      },
      {
        label: '重新登录',
        isDev: true,
        onClick: async () => {
          const uuid = await rnStorage.get('uuid');
          const token = await rnStorage.get('token');
          console.log('正在尝试自动重新登录...');
          this.props.dispatch(loginWithToken(uuid, token));
        },
      },
      {
        label: '清理缓存',
        onClick: () => {
          window.localStorage.clear();
          window.sessionStorage.clear();
          window.location.reload();
        },
      },
      {
        label: '帮助反馈',
        onClick: () => {
          this.props.dispatch(
            showModal(
              <ModalPanel title="帮助反馈" className="help">
                <PortalView url="/help/feedback" />
              </ModalPanel>
            )
          );
        },
      },
      {
        label: '免责声明',
        onClick: () => {
          this.props.dispatch(
            showPortal('/about/disclaimer', 'standalonewindow', {
              title: '免责声明',
            })
          );
        },
      },
      {
        label: '官方网站',
        onClick: () => {
          window.open(config.url.homepage);
        },
      },
      {
        label: '开发博客',
        onClick: () => {
          window.open(config.url.blog);
        },
      },
      {
        label: '退出登录',
        onClick: () => {
          this.props.dispatch(logout());
        },
      },
    ],
  };

  _getContent() {
    const type = this.state.show;

    if (this.actions[type]) {
      const items = this.actions[type];
      return (
        <ul>
          {items.map((item) => {
            const el = <li onClick={item.onClick}>{item.label}</li>;
            const key = item.label;

            return item.isDev === true ? (
              <DevContainer key={key}>{el}</DevContainer>
            ) : (
              <Fragment key={key}>{el}</Fragment>
            );
          })}
        </ul>
      );
    } else {
      return null;
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
