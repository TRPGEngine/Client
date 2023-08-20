import React, { useCallback, useMemo } from 'react';
import { connect, DispatchProp } from 'react-redux';
import Base from './Base';
import type {
  MsgPayload,
  RenderMsgPayload,
} from '@src/shared/redux/types/chat';
import BBCode from './bbcode/__all__';
import { useWebsiteInfo } from '@shared/hooks/useWebsiteInfo';
import _isString from 'lodash/isString';
import styled from 'styled-components';
import { revokeMsg } from '@redux/actions/chat';
import { TMemo } from '@shared/components/TMemo';
import {
  MsgOperationListItemContainer,
  MsgOperationItem,
} from './addons/MsgOperations';
import { useMsgContainerContext } from '@shared/context/MsgContainerContext';
import { useTPopoverContext } from '../popover';
import { MsgQuote } from './addons/MsgQuote';
import { Bubble, DefaultAddonContentContainer } from './style';
import { t, useTranslation } from '@shared/i18n';
import { isLocalMsgUUID } from '@shared/utils/uuid';
import { showToasts } from '@shared/manager/ui';
import type { MessageProps } from '@shared/components/message/MessageHandler';
import type { TRPGState } from '@redux/types/__all__';

const DefaultAddonContent: React.FC<{ message: string }> = TMemo((props) => {
  const { loading, hasUrl, info } = useWebsiteInfo(props.message);

  if (!hasUrl || loading || info.title === '') {
    return null;
  }

  return (
    <DefaultAddonContentContainer href={info.url} target="_blank">
      <div className="info">
        <p>{info.title}</p>
        <p>{info.content}</p>
      </div>
      <div className="icon">
        {_isString(info.icon) && <img src={info.icon} />}
      </div>
    </DefaultAddonContentContainer>
  );
});
DefaultAddonContent.displayName = 'DefaultAddonContent';

const DefaultMsgReply: React.FC<{
  payload: RenderMsgPayload;
}> = TMemo((props) => {
  const { hasContext, setReplyMsg } = useMsgContainerContext(); // 仅当有上下文的时候才会渲染回复按钮
  const { closePopover } = useTPopoverContext();
  const { t } = useTranslation();

  const handleClick = useCallback(() => {
    setReplyMsg(props.payload);
    closePopover();
  }, [props.payload, setReplyMsg, closePopover]);

  return useMemo(
    () =>
      hasContext ? (
        <MsgOperationListItemContainer onClick={handleClick}>
          {t('回复')}
        </MsgOperationListItemContainer>
      ) : null,
    [hasContext, handleClick]
  );
});
DefaultMsgReply.displayName = 'DefaultMsgReply';

interface Props extends MessageProps, DispatchProp<any> {
  isGroupOwner: boolean;
}
class Default extends Base<Props> {
  getOperation(): MsgOperationItem[] {
    const { info, me } = this.props;

    const operations: MsgOperationItem[] = [];
    operations.push({
      component: <DefaultMsgReply payload={this.props.info} />,
    });
    if (me || this.props.isGroupOwner) {
      // 当消息时自己发起的时候，可以撤回
      operations.push({
        name: t('撤回'),
        action: ({ dispatch, closePopover }) => {
          // 撤回消息
          const msgUUID = this.props.info.uuid;
          if (isLocalMsgUUID(msgUUID)) {
            showToasts('操作过于频繁, 请稍后再试');
          } else {
            dispatch(revokeMsg(info.uuid));
          }
          closePopover();
        },
      });
    }

    return operations;
  }

  getContent() {
    const info = this.props.info || ({} as MsgPayload);
    return (
      <Bubble>
        {this.msgDataManager.hasReplyMsg() && (
          <MsgQuote replyMsg={this.msgDataManager.getReplyMsg()!} />
        )}
        <BBCode plainText={info.message} />
        <DefaultAddonContent message={info.message} />
      </Bubble>
    );
  }
}

export default connect((state: TRPGState, props: MessageProps) => ({
  isGroupOwner:
    props.info.group_uuid &&
    state.group.groups.find((group) => group.uuid === props.info.group_uuid)
      ?.owner_uuid === state.user.info.uuid,
}))(Default as any);
