import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { isUserUUID } from '@shared/utils/uuid';
import { removeUserConverse } from '../../shared/redux/actions/chat';
import { showProfileCard } from '../../shared/redux/actions/ui';
import './ConvItem.scss';

interface Props extends DispatchProp<any> {
  icon: string;
  title: string;
  time: string;
  content: string;
  uuid: string;
  isWriting: boolean;

  unread?: boolean;
  isSelected?: boolean;
  hideCloseBtn?: boolean;
  onClick?: any;
}
class ConvItem extends React.Component<Props> {
  get allowClose() {
    return isUserUUID(this.props.uuid);
  }

  handleCloseConv(e) {
    if (this.allowClose) {
      console.log('close conv:', this.props.uuid);
      this.props.dispatch(removeUserConverse(this.props.uuid));
      e.stopPropagation();
    } else {
      console.log('暂不支持关闭该类型的会话');
    }
  }

  handleShowInfo(e) {
    if (this.allowClose) {
      e.stopPropagation();
      this.props.dispatch(showProfileCard(this.props.uuid));
    }
  }

  render() {
    let closeBtn = !this.props.hideCloseBtn ? (
      <div className="close" onClick={(e) => this.handleCloseConv(e)}>
        {this.allowClose ? <i className="iconfont">&#xe70c;</i> : null}
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
        <div className="icon" onClick={(e) => this.handleShowInfo(e)}>
          <img src={this.props.icon} />
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

export default connect()(ConvItem);
