import React, { useCallback, useContext } from 'react';
import dateHelper from '@shared/utils/date-helper';
import config from '@shared/project.config';
import { MessageProps } from '@shared/components/message/MessageHandler';
import _get from 'lodash/get';
import { getAbsolutePath } from '@shared/utils/file-helper';
import Avatar from '../Avatar';
import PopoverMsgSenderInfo from '../popover/MsgSenderInfo';
import { TPopover, TPopoverContext } from '../popover';
import { TMemo } from '@shared/components/TMemo';
import styled from 'styled-components';
import { useTRPGDispatch } from '@shared/hooks/useTRPGSelector';
import _isFunction from 'lodash/isFunction';
import _isString from 'lodash/isString';
import { TRPGDispatch } from '@redux/types/__all__';
import { LoadingSpinnerSmall } from '../LoadingSpinnerSmall';
import { isUserOrGroupUUID } from '@shared/utils/uuid';
import { useDelayLoading } from '@shared/hooks/useDelay';
import { useMessageItemConfigContext } from '@shared/components/message/MessageItemConfigContext';

interface MsgOperationItemContext {
  dispatch: TRPGDispatch;
  closePopover: () => void;
}
export interface MsgOperationItem {
  name: string;
  action: (ctx: MsgOperationItemContext) => void;
}

const MsgOperationListItemContainer = styled.div`
  padding: 4px 10px;
  cursor: pointer;
  border-bottom: ${(props) => props.theme.border.standard};

  &:hover {
    background-color: ${(props) => props.theme.color.transparent90};
  }
`;
const MsgOperationListItem: React.FC<MsgOperationItem> = TMemo((props) => {
  const dispatch = useTRPGDispatch();
  const context = useContext(TPopoverContext);
  const handleClick = useCallback(() => {
    _isFunction(props.action) &&
      props.action({ dispatch, closePopover: context.closePopover });
  }, [dispatch, context.closePopover]);

  return (
    <MsgOperationListItemContainer onClick={handleClick}>
      {props.name}
    </MsgOperationListItemContainer>
  );
});
MsgOperationListItem.displayName = 'MsgOperationListItem';

/**
 * 渲染消息loading
 */
const MessageLoading: React.FC<{
  loading: boolean;
}> = TMemo((props) => {
  const isLoading = useDelayLoading(props.loading);

  return isLoading && <LoadingSpinnerSmall />;
});
MessageLoading.displayName = 'MessageLoading';

/**
 * 渲染消息操作列表
 */
const MessageOperations: React.FC<{
  operations: MsgOperationItem[];
}> = TMemo((props) => {
  const { operations } = props;
  const { operation } = useMessageItemConfigContext();

  if (!operation) {
    return null;
  }

  return (
    <TPopover
      overlayClassName="operation-popover"
      placement="topRight"
      trigger="click"
      content={
        <div>
          {operations.map((op) => (
            <MsgOperationListItem
              key={op.name}
              name={op.name}
              action={op.action}
            />
          ))}
        </div>
      }
    >
      <div className="operation">
        <i className="iconfont">&#xe625;</i>
      </div>
    </TPopover>
  );
});
MessageOperations.displayName = 'MessageOperations';

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

  getContent() {
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

    if (info.revoke === true) {
      // 撤回消息显示
      return (
        <div className="msg-item-tip">
          <div className="content">{name} 撤回了一条消息</div>
        </div>
      );
    }

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
            {this.checkSenderIsUser() ? (
              <TPopover
                placement={me ? 'left' : 'right'}
                trigger="click"
                content={<PopoverMsgSenderInfo payload={info} />}
              >
                <div>
                  <Avatar
                    name={this.getSenderName()}
                    src={this.getAvatarUrl()}
                    size={38}
                  />
                </div>
              </TPopover>
            ) : (
              <Avatar
                name={this.getSenderName()}
                src={this.getAvatarUrl()}
                size={38}
              />
            )}
          </div>
          <div className="body">
            {this.getContent()}

            <MessageLoading loading={isLoading} />

            {!isLoading && operations.length > 0 && (
              <MessageOperations operations={operations} />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Base;
