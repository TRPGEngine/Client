const React = require('react');
const PropTypes = require('prop-types');
require('./MsgItem.scss');

class MsgItem extends React.Component {
  render() {
    return (
      <div className={this.props.me?"msg-item me":"msg-item"}>
        <div className="profile">
          <span className="name">{this.props.name}</span>
          <span className="time">{this.props.time}</span>
        </div>
        <div className="content">
          <div className="avatar"><img src={this.props.icon} /></div>
          <div className="bubble">{this.props.content}</div>
        </div>
      </div>
    )
  }
}

MsgItem.propTypes = {
  icon: PropTypes.string,
  name: PropTypes.string,
  time: PropTypes.string,
  content: PropTypes.string,
  me: PropTypes.bool,
}

module.exports = MsgItem;
