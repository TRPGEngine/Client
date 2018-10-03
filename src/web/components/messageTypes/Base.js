const React = require('react');
const dateHelper = require('../../../shared/utils/dateHelper');

class Base extends React.Component {
  getContent() {
    return null;
  }

  render() {
    // TODO
    return (
      <div className={'msg-item '+(this.props.me?'me ':'') + this.props.type}>
        {
          this.props.emphasizeTime ? (
            <div className="emphasize-time"><span>{dateHelper.getShortDate(this.props.time)}</span></div>
          ) : null
        }
        <div className="profile">
          <span className="name">{this.props.name}</span>
          <span className="time">{dateHelper.getMsgDate(this.props.time)}</span>
        </div>
        <div className="content">
          <div className="avatar"><img src={this.props.icon} /></div>
          <div className="body">
            {this.getContent()}
          </div>
        </div>
      </div>
    )
  }
}

module.exports = Base;
