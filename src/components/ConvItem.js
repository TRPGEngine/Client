const React = require('react');
const PropTypes = require('prop-types');
require('./ConvItem.scss');

class ConvItem extends React.Component {
  render() {
    return (
      <div className={this.props.isSelected?"conv-item active":"conv-item"} onClick={this.props.onClick}>
        <div className="close"><i className="fa fa-close"></i></div>
        <div className="icon"><img src={this.props.icon}></img></div>
        <div className="body">
          <div className="title"><p>{this.props.title}</p><span>{this.props.time}</span></div>
          <div className="content">{this.props.content}</div>
        </div>
      </div>
    )
  }
}

ConvItem.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string,
  time: PropTypes.string,
  content: PropTypes.string,
}

module.exports = ConvItem;
