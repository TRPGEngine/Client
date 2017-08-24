const React = require('react');
const { connect } = require('react-redux');
const { getConverses } = require('../redux/actions/chat');

const MenuPannel = require('./main/MenuPannel');
const InfoCard = require('../components/InfoCard');

require('./Main.scss');

class Main extends React.Component {
  componentDidMount() {
    if(!this.props.isLogin) {
      this.props.history.push('login');
    }

    this.props.dispatch(getConverses());
  }

  render() {
    const {userInfo, showInfoCard} = this.props;
    return (
      <div id="main">
        <InfoCard
          show={showInfoCard}
          name={userInfo.get('username')}
          avatar={userInfo.get('avatar')}
          uuid={userInfo.get('uuid')}
        >

        </InfoCard>
        <div className="head">
          <span className="title">TRPG - 桌上角色扮演游戏客户端</span>
        </div>
        <MenuPannel className="body"/>
      </div>
    )
  }
}

module.exports = connect(
  state => ({
    isLogin: state.getIn(['user', 'isLogin']),
    showInfoCard: state.getIn(['ui', 'showInfoCard']),
    userInfo: state.getIn(['ui', 'infoCard'])
  })
)(Main);
