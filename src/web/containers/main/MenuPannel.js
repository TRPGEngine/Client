const React = require('react');
const { connect } = require('react-redux');
const { Route, Link } = require('react-router-dom')
const config = require('../../../../config/project.config.js');
const { showProfileCard, switchMenuPannel } = require('../../../redux/actions/ui');
const SlidePanel = require('../../components/SlidePanel');
const ConverseList = require('./converse/ConverseList');
const ActorList = require('./actors/ActorList');
const GroupList = require('./group/GroupList');
const NoteList = require('./note/NoteList');
const ExtraOptions = require('./ExtraOptions');

require('./MenuPannel.scss');

class MenuPannel extends React.Component {
  constructor(props) {
    super(props);
    this.menus = [
      {
        icon: '&#xe63e;',
        activeIcon: '&#xe63e;',
        text: '消息',
        component: (
          <ConverseList />
        )
      },
      {
        icon: '&#xe61b;',
        activeIcon: '&#xe61b;',
        text: '人物卡',
        component: (
          <ActorList />
        )
      },
      {
        icon: '&#xe958;',
        activeIcon: '&#xe958;',
        text: '团',
        component: (
          <GroupList />
        )
      },
      {
        icon: '&#xe624;',
        activeIcon: '&#xe624;',
        text: '记事本',
        component: (
          <NoteList />
        )
      },
    ]
  }

  _handleSwitchMenu(index) {
    this.props.dispatch(switchMenuPannel(index, this.menus[index].component));
  }

  render() {
    let { className, avatar, selectedMenu } = this.props;
    return (
      <div className={className}>
        <div className="sidebar">
          <div className="profile">
            <div className="avatar" onClick={() => this.props.dispatch(showProfileCard())}>
              <img src={avatar || config.defaultImg.user} />
            </div>
          </div>
          <div className="menus">
            {
              this.menus.map((item, index) => {
                return (
                  <a
                    key={"menu-"+index}
                    className={selectedMenu===index?'active':''}
                    onClick={() => this._handleSwitchMenu(index)}
                  >
                    <i className='iconfont' dangerouslySetInnerHTML={{__html:(selectedMenu===index?item.icon:item.activeIcon)}}></i>
                    <span>{item.text}</span>
                  </a>
                )
              })
            }
          </div>
          <ExtraOptions />
        </div>
        <div className="menu-panel">
          {this.props.selectedPannel || this.menus[selectedMenu].component || null}
          <SlidePanel />
        </div>
      </div>
    )
  }
}

module.exports = connect(
  state => ({
    avatar: state.getIn(['user', 'info', 'avatar']),
    selectedMenu: state.getIn(['ui', 'menuIndex']),
    selectedPannel: state.getIn(['ui', 'menuPannel'])
  })
)(MenuPannel);
