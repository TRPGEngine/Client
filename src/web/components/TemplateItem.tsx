import React from 'react';
import moment from 'moment';

import './TemplateItem.scss';
import { Tooltip } from 'antd';

interface Props {
  canEdit: boolean;
  name: string;
  desc: string;
  creator: string;
  time: string;
  onCreate?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}
class TemplateItem extends React.PureComponent<Props> {
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
    const { name, desc, creator, time } = this.props;
    return (
      <div className="template-item">
        <div className="header">
          <Tooltip title={name}>
            <div className="name">{name}</div>
          </Tooltip>
          {this.getActions()}
        </div>
        <Tooltip title={desc} trigger="click">
          <div className="desc">{desc}</div>
        </Tooltip>
        <div className="footer">
          <div className="creator" title={creator}>
            {creator}
          </div>
          <div className="time">
            {moment(time).format('YYYY-MM-DD HH:mm:ss')}
          </div>
        </div>
      </div>
    );
  }
}

export default TemplateItem;
