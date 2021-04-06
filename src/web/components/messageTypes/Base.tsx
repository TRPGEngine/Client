import React from 'react';
import type { MessageProps } from '@shared/components/message/MessageHandler';
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
import { MsgItem } from './style';
import { getWebMsgDefaultAvatar } from '@web/utils/msg-helper';
import { TMemo } from '@shared/components/TMemo';
import { useTRPGSelector } from '@shared/hooks/useTRPGSelector';
import { useMessageItemConfigContext } from '@shared/components/message/MessageItemConfigContext';

/**
 * 消息容器
 * 主要是为了拿设置中的对话消息类型
 */
const MsgContainer: React.FC<{
  me: boolean;
  type: string;
  omitSenderInfo: boolean;
}> = TMemo((props) => {
  const { me, type, omitSenderInfo = false } = props;
  const msgStyleType = useTRPGSelector(
    (state) => state.settings.user.msgStyleType
  );

  return (
    <MsgItem className={classNames({ me, omitSenderInfo }, type, msgStyleType)}>
      {props.children}
    </MsgItem>
  );
});
MsgContainer.displayName = 'MsgContainer';

const AvatarRenderContainer: React.FC = TMemo((props) => {
  const { showAvatar } = useMessageItemConfigContext();

  if (showAvatar === false) {
    return null;
  }

  return <div className="avatar">{props.children}</div>;
});
AvatarRenderContainer.displayName = 'AvatarRenderContainer';

class Base<
  P extends MessageProps = MessageProps
> extends React.PureComponent<P> {
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
    const defaultAvatar = getWebMsgDefaultAvatar(info.sender_uuid, name);

    const dataAvatar = getAbsolutePath(_get(info, ['data', 'avatar']) ?? '');

    // 这里就是要处理dataAvatar avatar 为空字符串的情况
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
    const {
      type,
      me,
      name,
      info,
      emphasizeTime,
      omitSenderInfo = false,
    } = this.props;
    const operations = this.getOperation();
    const isLoading = this.isLoading;
    const senderName = this.getSenderName();

    if (info.revoke === true) {
      // 撤回消息显示
      return <MsgRevoke senderName={senderName} />;
    }

    return (
      <MsgContainer me={me} type={type} omitSenderInfo={omitSenderInfo}>
        {emphasizeTime ? <EmphasizeTime date={info.date} /> : null}
        {!omitSenderInfo && <MsgProfile name={senderName} date={info.date} />}
        <div className="content">
          <AvatarRenderContainer>
            {!omitSenderInfo && (
              <MsgAvatar
                me={me}
                name={senderName}
                src={this.getAvatarUrl()}
                info={info}
              />
            )}
          </AvatarRenderContainer>

          <div className="body">
            {this.getContent()}

            <MessageLoading loading={isLoading} />

            {!isLoading && operations.length > 0 && (
              <MsgOperations operations={operations} />
            )}
          </div>
        </div>
      </MsgContainer>
    );
  }
}

export default Base;
