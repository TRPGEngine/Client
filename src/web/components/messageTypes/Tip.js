const React = require('react');
const Base = require('./Base');

class Tip extends Base {
  render() {
    const info = this.props.info;
    return (
      <div className="msg-item-tip">
        <div className="content">{info.message}</div>
      </div>
    )
  }
}

module.exports = Tip;
