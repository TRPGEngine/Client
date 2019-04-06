import React from 'react';
import moment from 'moment';

import './TemplateItem.scss';

class TemplateItem extends React.Component {
  constructor(props) {
    super(props);
  }

  getActions() {
    return (
      <div className="actions">
        {this.props.canEdit ? (
          <div>
            <button data-tip="删除模板" onClick={this.props.onDelete}>
              <i className="iconfont">&#xe76b;</i>
            </button>
            <button data-tip="编辑模板" onClick={this.props.onEdit}>
              <i className="iconfont">&#xe83f;</i>
            </button>
          </div>
        ) : null}
        <button data-tip="创建人物" onClick={this.props.onCreate}>
          <i className="iconfont">&#xe61d;</i>
        </button>
      </div>
    );
  }

  render() {
    return (
      <div className="template-item">
        <div className="header">
          <div className="name">{this.props.name}</div>
          {this.getActions()}
        </div>
        <div className="desc">{this.props.desc}</div>
        <div className="footer">
          <div className="creator" title={this.props.creator}>
            {this.props.creator}
          </div>
          <div className="time">
            {moment(this.props.time).format('YYYY-MM-DD HH:mm:ss')}
          </div>
        </div>
      </div>
    );
  }
}

export default TemplateItem;
