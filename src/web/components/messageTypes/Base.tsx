import React from 'react';
import dateHelper from '@shared/utils/date-helper';
import config from '@shared/project.config';
import { MessageProps } from '@shared/components/message/MessageHandler';
import _get from 'lodash/get';
import { getAbsolutePath } from '@shared/utils/file-helper';
import _isFunction from 'lodash/isFunction';
import _isString from 'lodash/isString';
import { isUserOrGroupUUID } from '@shared/utils/uuid';
import { MsgRevoke } from './addons/MsgRevoke';
import { MessageLoading } from './addons/MsgLoading';
import { MsgOperations, MsgOperationItem } from './addons/MsgOperations';
import { MsgAvatar } from './addons/MsgAvatar';
import { MsgDataManager } from '@shared/utils/msg-helper';
import { EmphasizeTime } from './addons/EmphasizeTime';
import classNames from 'classnames';
import { MsgProfile } from './addons/MsgProfile';

class Base<P extends MessageProps = MessageProps> extends React.PureComponent<
  P
> {
  static defaultProps = {
    type: 'normal',
    me: false,
    name: '',
    info: {},
    emphasizeTime: false,
  };

  msgDataManager = new MsgDataManager();

  constructor(props: P) {
    super(props);
    this.msgDataManager.parseData(props.info?.data);
  }

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
    const { avatar, name, info } = this.props;
    const defaultAvatar =
      info.sender_uuid === 'trpgsystem'
        ? config.defaultImg.trpgsystem
        : config.defaultImg.getUser(name);

    const dataAvatar = getAbsolutePath(_get(info, 'data.avatar', ''));

    return dataAvatar || avatar || defaultAvatar;
  }

  getContent(): React.ReactNode {
    return null;
  }

  getOperation(): MsgOperationItem[] {
    return [];
  }

  checkSenderIsUser(): boolean {
    return isUserOrGroupUUID(_get(this.props.info, ['sender_uuid']));
  }

  get isLoading(): boolean {
    const { info } = this.props;

    return _isString(info.uuid) && info.uuid.startsWith('local');
  }

  render() {
    const { type, me, name, info, emphasizeTime } = this.props;
    const operations = this.getOperation();
    const isLoading = this.isLoading;
    const senderName = this.getSenderName();

    if (info.revoke === true) {
      // 撤回消息显示
      return <MsgRevoke senderName={senderName} />;
    }

    return (
      <div className={classNames('msg-item', { me }, type)}>
        {emphasizeTime ? <EmphasizeTime date={info.date} /> : null}
        <MsgProfile name={senderName} date={info.date} />
        <div className="content">
          <div className="avatar">
            <MsgAvatar
              me={me}
              name={senderName}
              src={this.getAvatarUrl()}
              info={info}
            />
          </div>
          <div className="body">
            {this.getContent()}

            <MessageLoading loading={isLoading} />

            {!isLoading && operations.length > 0 && (
              <MsgOperations operations={operations} />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Base;
