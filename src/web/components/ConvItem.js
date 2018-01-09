const React = require('react');
const PropTypes = require('prop-types');
const { connect } = require('react-redux');
const { isUserUUID } = require('../../utils/uuid');
const { removeConverse } = require('../../redux/actions/chat');
const { showProfileCard } = require('../../redux/actions/ui');
require('./ConvItem.scss');

class ConvItem extends React.Component {
  _handleCloseConv(e) {
    if(isUserUUID(this.props.uuid)) {
      console.log('close conv:',this.props.uuid);
      this.props.dispatch(removeConverse(this.props.uuid));
      e.stopPropagation();
    }
  }

  _handleShowInfo(e) {
    if(isUserUUID(this.props.uuid)) {
      e.stopPropagation();
      this.props.dispatch(showProfileCard(this.props.uuid));
    }
  }

  render() {
    let closeBtn = !this.props.hideCloseBtn ? (
      <div className="close" onClick={(e) => this._handleCloseConv(e)}><i className="iconfont">&#xe70c;</i></div>
    ) : null

    return (
      <div
        className={`conv-item ${this.props.isSelected?'active':''} ${this.props.hideCloseBtn?'hide-close-btn':''} ${this.props.unread?'unread':''}`}
        onClick={this.props.onClick}
      >
        {closeBtn}
        <div
          className="icon"
          onClick={(e) => this._handleShowInfo(e)}
        >
          <img src={this.props.icon}></img>
        </div>
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
  uuid: PropTypes.string,
}

module.exports = connect()(ConvItem);
