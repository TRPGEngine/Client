const React = require('react');
const { connect } = require('react-redux');
const { getConverses } = require('../redux/actions/chat');
const { getFriends, getFriendsInvite } = require('../redux/actions/user');
const { getTemplate, getActor } = require('../redux/actions/actor');
const { getGroupList, getGroupInvite } = require('../redux/actions/group');
const { getNote } = require('../redux/actions/note');
const { switchMenuPannel } = require('../redux/actions/ui');
const ConverseList = require('./main/converse/ConverseList');

const MenuPannel = require('./main/MenuPannel');
const ProfileCard = require('../components/ProfileCard');

require('./Main.scss');

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      titleMenuIndex: 0,
    }
    this.titleMenu = [
      {
        name: '平台',
        menuIndex: 0,
        component: (
          <ConverseList />
        ),
      },
      {
        name: '广场',
        menuIndex: -1,
        component: (
          <div>广场</div>
        ),
      },
      {
        name: '应用',
        menuIndex: -1,
        component: (
          <div>应用</div>
        ),
      },
    ]
  }

  componentDidMount() {
    if(!this.props.isLogin) {
      this.props.history.push('login');
    }else {
      this.props.getConverses();
      this.props.getFriends();
      this.props.getFriendsInvite();
      this.props.getSelfTemplate();
      this.props.getSelfActor();
      this.props.getNote();
      this.props.getGroupList();
      this.props.getGroupInvite();
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if(!nextProps.isLogin) {
      this.props.history.push('login');
    }
  }

  _handleSelectTitleMenu(index) {
    let menu = this.titleMenu[index];
    if(menu) {
      this.props.switchMenuPannel(menu.menuIndex !== undefined ? menu.menuIndex : -1, menu.component);
    }
    this.setState({titleMenuIndex: index});
  }

  render() {
    return (
      <div id="main">
        <ProfileCard />
        <div className="head">
          <span className="title">TRPG - 桌上角色扮演游戏客户端</span>
          <div className="menu">
            {
              this.titleMenu.map((menu, index) => {
                return (
                  <button className={index === this.state.titleMenuIndex ? "active" : ""} onClick={() => this._handleSelectTitleMenu(index)}>{menu.name}</button>
                )
              })
            }
          </div>
        </div>
        <MenuPannel className="body"/>
      </div>
    )
  }
}

module.exports = connect(
  state => ({
    isLogin: state.getIn(['user', 'isLogin']),
  }),
  dispatch => ({
    getConverses: () => {
      dispatch(getConverses());
    },
    getFriends: () => {
      dispatch(getFriends());
    },
    getFriendsInvite: () => {
      dispatch(getFriendsInvite());
    },
    getSelfTemplate: () => {
      dispatch(getTemplate());
    },
    getSelfActor: () => {
      dispatch(getActor());
    },
    getNote: () => {
      dispatch(getNote());
    },
    getGroupList: () => {
      dispatch(getGroupList());
    },
    getGroupInvite: () => {
      dispatch(getGroupInvite());
    },
    switchMenuPannel: (index, pannel) => {
      dispatch(switchMenuPannel(index, pannel));
    },
  })
)(Main);
