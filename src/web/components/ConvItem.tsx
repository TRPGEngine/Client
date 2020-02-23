import React from 'react';
import { isUUID } from '@shared/utils/uuid';
import './ConvItem.scss';
import Avatar from './Avatar';

interface Props {
  icon: string;
  title: string;
  time: string;
  content: string;
  uuid: string;

  isWriting?: boolean;
  unread?: boolean;
  isSelected?: boolean;
  hideCloseBtn?: boolean;
  onClick?: () => void;
  onClickIcon?: () => void;
  onClickCloseBtn?: () => void;
}
class ConvItem extends React.PureComponent<Props> {
  handleCloseConv = (e) => {
    if (this.props.onClickCloseBtn) {
      e.stopPropagation();
      console.log('close conv:', this.props.uuid);
      this.props.onClickCloseBtn();
    }
  };

  handleShowInfo = (e) => {
    if (this.props.onClickIcon && isUUID(this.props.uuid)) {
      e.stopPropagation();
      this.props.onClickIcon();
    }
  };

  render() {
    const closeBtn = !this.props.hideCloseBtn ? (
      <div className="close" onClick={this.handleCloseConv}>
        {isUUID(this.props.uuid) && <i className="iconfont">&#xe70c;</i>}
      </div>
    ) : null;

    return (
      <div
        className={`conv-item ${this.props.isSelected ? 'active' : ''} ${
          this.props.hideCloseBtn ? 'hide-close-btn' : ''
        } ${this.props.unread ? 'unread' : ''}`}
        onClick={this.props.onClick}
      >
        {closeBtn}
        <div className="icon" onClick={this.handleShowInfo}>
          <Avatar name={this.props.title} src={this.props.icon} size={38} />
        </div>
        <div className="body">
          <div className="title">
            <p>{this.props.title}</p>
            <span>{this.props.time}</span>
          </div>
          <div className="content">
            {this.props.isWriting ? (
              <small>(正在输入...)</small>
            ) : (
              this.props.content
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default ConvItem;
