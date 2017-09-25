const React = require('react');
const moment = require('moment');

require('./TemplateItem.scss');

class TemplateItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render()　{
    return (
      <div className="template-item">
        <div className="header">
          <div className="name">{this.props.name}</div>
          <div className="actions">
            <button data-tip="编辑" onClick={this.props.onEdit}>
              <i className="iconfont">&#xe83f;</i>
            </button>
          </div>
        </div>
        <div className="desc">{this.props.desc}</div>
        <div className="footer">
          <div className="creator" title="moonrailgun">{this.props.creator}</div>
          <div className="time">{moment(this.props.time).format('YYYY-MM-DD HH:mm:ss')}</div>
        </div>
      </div>
    )
  }
}

module.exports = TemplateItem;
