const React = require('react');
const { connect } = require('react-redux');
const { Route, Link } = require('react-router-dom')

const ConverseList = require('./ConverseList');

require('./MenuPannel.scss');

class MenuPannel extends React.Component {
  render() {
    return (
      <div className={this.props.className}>
        <div className="menu-pannel">
          <Link to="/main/conv">
            <i className="fa fa-comments-o fa-2x"></i><span>消息</span>
          </Link>
          <Link to="/main/conv">
            <i className="fa fa-comments-o fa-2x"></i><span>消息</span>
          </Link>
          <Link to="/main/conv">
            <i className="fa fa-comments-o fa-2x"></i><span>消息</span>
          </Link>
        </div>
        <div className="menu-sub-panel">
          <Route name="conv" path="/main/conv" component={ConverseList} />
        </div>
      </div>
    )
  }
}

module.exports = connect(
  state => ({

  })
)(MenuPannel);
