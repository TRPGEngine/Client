import React from 'react';
import { connect } from 'react-redux';
import config from '../../../../config/project.config.js';
import { showProfileCard, switchMenuPannel } from '../../../redux/actions/ui';
import SlidePanel from '../../components/SlidePanel';
import ConverseList from './converse/ConverseList';
import ActorList from './actors/ActorList';
import GroupList from './group/GroupList';
import NoteList from './note/NoteList';
import ExtraOptions from './ExtraOptions';

require('./MenuPannel.scss');

class MenuPannel extends React.Component {
  constructor(props) {
    super(props);
    this.menus = [
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
  }

  _handleSwitchMenu(index) {
    this.props.dispatch(switchMenuPannel(index, this.menus[index].component));
  }

  render() {
    let { className, avatar, name, selectedMenu } = this.props;
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
                  className={selectedMenu === index ? 'active' : ''}
                  onClick={() => this._handleSwitchMenu(index)}
                >
                  <i
                    className="iconfont"
                    dangerouslySetInnerHTML={{
                      __html:
                        selectedMenu === index ? item.icon : item.activeIcon,
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
            this.menus[selectedMenu].component ||
            null}
          <SlidePanel />
        </div>
      </div>
    );
  }
}

export default connect((state) => ({
  avatar: state.getIn(['user', 'info', 'avatar']),
  name:
    state.getIn(['user', 'info', 'nickname']) ||
    state.getIn(['user', 'info', 'username']),
  selectedMenu: state.getIn(['ui', 'menuIndex']),
  selectedPannel: state.getIn(['ui', 'menuPannel']),
}))(MenuPannel);
