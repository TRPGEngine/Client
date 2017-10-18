const React = require('react');
const { connect } = require('react-redux');
const { Route, Link } = require('react-router-dom')
const { showProfileCard, switchMenu } = require('../../redux/actions/ui');
const ConverseList = require('./converse/ConverseList');
const ActorList = require('./actors/ActorList');
const FriendsList = require('./friends/FriendsList');
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
        icon: '&#xe607;',
        activeIcon: '&#xe607;',
        text: '好友',
        component: (
          <FriendsList />
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

  render() {
    let { className, avatar, selectedMenu } = this.props;
    return (
      <div className={className}>
        <div className="menu-pannel">
          <div className="profile">
            <div className="avatar" onClick={() => this.props.dispatch(showProfileCard())}>
              <img src={avatar || '/src/assets/img/gugugu1.png'} />
            </div>
          </div>
          <div className="menus">
            {
              this.menus.map((item, index) => {
                return (
                  <a
                    key={"menu-"+index}
                    className={selectedMenu===index?'active':''}
                    onClick={ () => this.props.dispatch(switchMenu(index)) }
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
        <div className="menu-sub-panel">
          {this.menus[selectedMenu].component || ''}
        </div>
      </div>
    )
  }
}

module.exports = connect(
  state => ({
    avatar: state.getIn(['user', 'info', 'avatar']),
    selectedMenu: state.getIn(['ui', 'menuIndex']),
  })
)(MenuPannel);
