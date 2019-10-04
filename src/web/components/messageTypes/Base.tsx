import React from 'react';
import dateHelper from '../../../shared/utils/date-helper';
import config from '../../../shared/project.config';
import { MessageProps } from '@shared/components/MessageHandler';
import _get from 'lodash/get';
import { getAbsolutePath } from '@shared/utils/file-helper';

class Base<P extends MessageProps = MessageProps> extends React.Component<P> {
  static defaultProps = {
    type: 'normal',
    me: false,
    name: '',
    info: {},
    emphasizeTime: false,
  };

  /**
   * 返回信息显示的发送者的名字
   * 获取顺序: 消息信息内发送者名 -> 传递来的名字(原始名)
   */
  getSenderName(): string {
    const { name, info } = this.props;

    return _get(info, 'data.name') || name;
  }

  /**
   * 返回信息avatar的地址
   * 获取顺序: 消息信息内头像 -> 传递来的头像(发送者) -> 默认头像
   */
  getAvatarUrl(): string {
    const { avatar, info } = this.props;
    const defaultAvatar =
      info.sender_uuid === 'trpgsystem'
        ? config.defaultImg.trpgsystem
        : config.defaultImg.getUser(name);

    const dataAvatar = getAbsolutePath(_get(info, 'data.avatar', ''));

    return dataAvatar || avatar || defaultAvatar;
  }

  getContent() {
    return null;
  }

  render() {
    const { type, me, name, info, emphasizeTime } = this.props;

    return (
      <div className={'msg-item ' + (me ? 'me ' : '') + type}>
        {emphasizeTime ? (
          <div className="emphasize-time">
            <span>{dateHelper.getShortDate(info.date)}</span>
          </div>
        ) : null}
        <div className="profile">
          <span className="name">{this.getSenderName()}</span>
          <span className="time">{dateHelper.getMsgDate(info.date)}</span>
        </div>
        <div className="content">
          <div className="avatar">
            <img src={this.getAvatarUrl()} />
          </div>
          <div className="body">{this.getContent()}</div>
        </div>
      </div>
    );
  }
}

export default Base;
