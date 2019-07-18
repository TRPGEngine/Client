import React from 'react';
import dateHelper from '../../../shared/utils/date-helper';
import config from '../../../../config/project.config';
import { MessageProps } from '@shared/components/MessageHandler';

class Base<P extends MessageProps = MessageProps> extends React.Component<P> {
  static defaultProps = {
    type: 'normal',
    me: false,
    name: '',
    info: {},
    emphasizeTime: false,
  };

  getContent() {
    return null;
  }

  render() {
    const { type, me, name, avatar, info, emphasizeTime } = this.props;
    let defaultAvatar =
      info.sender_uuid === 'trpgsystem'
        ? config.defaultImg.trpgsystem
        : config.defaultImg.getUser(name);

    return (
      <div className={'msg-item ' + (me ? 'me ' : '') + type}>
        {emphasizeTime ? (
          <div className="emphasize-time">
            <span>{dateHelper.getShortDate(info.date)}</span>
          </div>
        ) : null}
        <div className="profile">
          <span className="name">{name}</span>
          <span className="time">{dateHelper.getMsgDate(info.date)}</span>
        </div>
        <div className="content">
          <div className="avatar">
            <img src={avatar || defaultAvatar} />
          </div>
          <div className="body">{this.getContent()}</div>
        </div>
      </div>
    );
  }
}

export default Base;
