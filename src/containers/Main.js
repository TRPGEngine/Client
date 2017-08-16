const React = require('react');
const { connect } = require('react-redux');

const MenuPannel = require('./main/MenuPannel');

require('./Main.scss');

class Main extends React.Component {
  render() {
    return (
      <div id="main">
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

  })
)(Main);
