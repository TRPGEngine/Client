import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import config from '@shared/project.config';
import { showProfileCard, switchMenuPannel } from '@shared/redux/actions/ui';
import SlidePanel from '../../components/SlidePanel';
import ConverseList from './converse/ConverseList';
import ActorList from './actors/ActorList';
import GroupList from './group/GroupList';
import NoteList from './note/NoteList';
import ExtraOptions from './ExtraOptions';
import { TRPGState } from '@redux/types/__all__';

import './MenuPannel.scss';

interface Props extends DispatchProp<any> {
  className: string;
  avatar: string;
  name: string;
  selectedPannel: any;
  selectedMenuIndex: number;
}
class MenuPannel extends React.Component<Props> {
  menus = [
    {
      icon: '&#xe63e;',
      activeIcon: '&#xe63e;',
      text: '消息',
      component: <ConverseList />,
    },
    {
      icon: '&#xe61b;',
      activeIcon: '&#xe61b;',
      text: '人物卡',
      component: <ActorList />,
    },
    {
      icon: '&#xe958;',
      activeIcon: '&#xe958;',
      text: '团',
      component: <GroupList />,
    },
    {
      icon: '&#xe624;',
      activeIcon: '&#xe624;',
      text: '记事本',
      component: <NoteList />,
    },
  ];

  handleSwitchMenu(index) {
    this.props.dispatch(switchMenuPannel(index, this.menus[index].component));
  }

  render() {
    let { className, avatar, name, selectedMenuIndex } = this.props;
    return (
      <div className={className}>
        <div className="sidebar">
          <div className="profile">
            <div
              className="avatar"
              onClick={() => this.props.dispatch(showProfileCard())}
            >
              <img src={avatar || config.defaultImg.getUser(name)} />
            </div>
          </div>
          <div className="menus">
            {this.menus.map((item, index) => {
              return (
                <a
                  key={'menu-' + index}
                  className={selectedMenuIndex === index ? 'active' : ''}
                  onClick={() => this.handleSwitchMenu(index)}
                >
                  <i
                    className="iconfont"
                    dangerouslySetInnerHTML={{
                      __html:
                        selectedMenuIndex === index
                          ? item.icon
                          : item.activeIcon,
                    }}
                  />
                  <span>{item.text}</span>
                </a>
              );
            })}
          </div>
          <ExtraOptions />
        </div>
        <div className="menu-panel">
          {this.props.selectedPannel ||
            this.menus[selectedMenuIndex].component ||
            null}
          <SlidePanel />
        </div>
      </div>
    );
  }
}

export default connect((state: TRPGState) => ({
  avatar: state.user.info.avatar,
  name: state.user.info.nickname || state.user.info.username,
  selectedPannel: state.ui.menuPannel,
  selectedMenuIndex: state.ui.menuIndex,
}))(MenuPannel);
