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
    }else {
      this.props.dispatch(getConverses());
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if(!nextProps.isLogin) {
      this.props.history.push('login');
    }
  }

  render() {
    const {showInfoCard, showInfoCardUUID} = this.props;
    return (
      <div id="main">
        <InfoCard
          show={showInfoCard}
          uuid={showInfoCardUUID}
        />
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
    showInfoCardUUID: state.getIn(['ui', 'showInfoCardUUID'])
  })
)(Main);
