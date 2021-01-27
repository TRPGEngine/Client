import React from 'react';
import { connect } from 'react-redux';
import config from '../../shared/project.config';
import { switchMenuPannel } from '../../shared/redux/actions/ui';
import ConverseList from './main/converse/ConverseList';
import { MenuPannel } from './main/MenuPannel';
import { GlobalShortcuts } from './main/GlobalShortcuts';
import ProfileCard from '../components/ProfileCard';
import IsDeveloping from '../components/IsDeveloping';
import { AnnouncementBar } from '@web/components/AnnouncementBar';
import type { TRPGDispatch, TRPGState } from '@src/shared/redux/types/__all__';
const TitleToolbar =
  config.platform === 'electron'
    ? require('../components/electron/TitleToolbar')
    : null;

import './Main.scss';
if (config.platform === 'electron') {
  require('./Main.electron.scss');
}

interface Props {
  isLogin: boolean;
  history: any;
  switchMenuPannel: any;
  menuIndex: number;
}
class Main extends React.Component<Props> {
  state = {
    titleMenuIndex: 0,
  };
  titleMenu = [
    {
      name: '平台',
      menuIndex: 0,
      component: <ConverseList />,
    },
    {
      name: '应用',
      menuIndex: -1,
      component: <IsDeveloping />,
    },
  ];

  componentDidMount() {
    if (!this.props.isLogin) {
      this.props.history.push('login');
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (!nextProps.isLogin) {
      this.props.history.push('login');
    }
  }

  handleSelectTitleMenu(index) {
    const menu = this.titleMenu[index];
    if (menu) {
      this.props.switchMenuPannel(
        menu.menuIndex !== undefined ? menu.menuIndex : -1,
        menu.component
      );
    }
    this.setState({ titleMenuIndex: index });
  }

  render() {
    return (
      <div id="main">
        <AnnouncementBar />
        <GlobalShortcuts />
        <ProfileCard />
        <div className="head">
          <span className="title">TRPG - 桌上角色扮演游戏客户端</span>
          <div className="title-blank" />
          <div className="menu">
            {this.titleMenu.map((menu, index) => {
              let isActive = false;
              if (this.props.menuIndex !== -1) {
                isActive = index === 0;
              } else {
                isActive = index === this.state.titleMenuIndex;
              }
              return (
                <button
                  key={'title-menu#' + index}
                  className={isActive ? 'active' : ''}
                  onClick={() => this.handleSelectTitleMenu(index)}
                >
                  {menu.name}
                </button>
              );
            })}
          </div>
          {TitleToolbar ? <TitleToolbar /> : null}
        </div>
        <MenuPannel className="body" />
      </div>
    );
  }
}

export default connect(
  (state: TRPGState) => ({
    isLogin: state.user.isLogin,
    menuIndex: state.ui.menuIndex,
  }),
  (dispatch: TRPGDispatch) => ({
    switchMenuPannel: (index, pannel) => {
      dispatch(switchMenuPannel(index, pannel));
    },
  })
)(Main);
