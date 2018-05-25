const React = require('react');
const { connect } = require('react-redux');
const config = require('../../../config/project.config');
// const { getConverses } = require('../../redux/actions/chat');
// const { getFriends, getFriendsInvite } = require('../../redux/actions/user');
// const { getTemplate, getActor } = require('../../redux/actions/actor');
// const { getGroupList, getGroupInvite } = require('../../redux/actions/group');
// const { getNote } = require('../../redux/actions/note');
const { switchMenuPannel } = require('../../redux/actions/ui');
const ConverseList = require('./main/converse/ConverseList');
const MenuPannel = require('./main/MenuPannel');
const ProfileCard = require('../components/ProfileCard');
const IsDeveloping = require('../components/IsDeveloping');
const Webview = require('../components/Webview');
const TitleToolbar = config.platform === 'electron' ? require('../components/electron/TitleToolbar') : null;

require('./Main.scss');
if(config.platform === 'electron') {
  require('./Main.electron.scss');
}

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
          <Webview src={config.url.goddessfantasy} allowExopen={true} />
        ),
      },
      {
        name: '应用',
        menuIndex: -1,
        component: (
          <IsDeveloping />
        ),
      },
    ];
  }

  componentDidMount() {
    if(!this.props.isLogin) {
      this.props.history.push('login');
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
          <div className="title-blank"></div>
          <div className="menu">
            {
              this.titleMenu.map((menu, index) => {
                let isActive = false;
                if(this.props.menuIndex !== -1) {
                  isActive = index === 0;
                }else {
                  isActive = index === this.state.titleMenuIndex;
                }
                return (
                  <button
                    key={'title-menu#' + index}
                    className={isActive ? 'active' : ''}
                    onClick={() => this._handleSelectTitleMenu(index)}
                  >{menu.name}</button>
                )
              })
            }
          </div>
          {TitleToolbar ? (
            <TitleToolbar />
          ) : null}
        </div>
        <MenuPannel className="body"/>
      </div>
    )
  }
}

module.exports = connect(
  state => ({
    isLogin: state.getIn(['user', 'isLogin']),
    menuIndex: state.getIn(['ui', 'menuIndex']),
  }),
  dispatch => ({
    // getConverses: () => {
    //   dispatch(getConverses());
    // },
    // getFriends: () => {
    //   dispatch(getFriends());
    // },
    // getFriendsInvite: () => {
    //   dispatch(getFriendsInvite());
    // },
    // getSelfTemplate: () => {
    //   dispatch(getTemplate());
    // },
    // getSelfActor: () => {
    //   dispatch(getActor());
    // },
    // getNote: () => {
    //   dispatch(getNote());
    // },
    // getGroupList: () => {
    //   dispatch(getGroupList());
    // },
    // getGroupInvite: () => {
    //   dispatch(getGroupInvite());
    // },
    switchMenuPannel: (index, pannel) => {
      dispatch(switchMenuPannel(index, pannel));
    },
  })
)(Main);
