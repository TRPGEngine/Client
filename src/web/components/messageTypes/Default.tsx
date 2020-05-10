import React, { useCallback, useMemo } from 'react';
import Base from './Base';
import { MsgPayload, RenderMsgPayload } from '@src/shared/redux/types/chat';
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

const DefaultAddonContentContainer = styled.div`
  border-top: ${(props) => props.theme.border.thin};
  display: flex;
  padding: 4px 0;
  cursor: pointer;

  > .info {
    flex: 1;

    > p:nth-child(2) {
      color: ${(props) => props.theme.color.gray};
    }
  }

  > .icon {
    padding: 6px;
    align-self: center;

    > img {
      max-width: 96px !important;
      max-height: 48px;
      border-radius: ${(props) => props.theme.radius.card};
    }
  }
`;
const DefaultAddonContent: React.FC<{ message: string }> = TMemo((props) => {
  const { loading, hasUrl, info } = useWebsiteInfo(props.message);

  const handleClick = useCallback(() => {
    if (hasUrl && _isString(info.url)) {
      window.open(info.url, '_blank');
    }
  }, [info.url]);

  if (!hasUrl || loading || info.title === '') {
    return null;
  }

  return (
    <DefaultAddonContentContainer onClick={handleClick}>
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

  const handleClick = useCallback(() => {
    setReplyMsg(props.payload);
    closePopover();
  }, [props.payload, setReplyMsg, closePopover]);

  return useMemo(
    () =>
      hasContext && (
        <MsgOperationListItemContainer onClick={handleClick}>
          回复
        </MsgOperationListItemContainer>
      ),
    [hasContext, handleClick]
  );
});
DefaultMsgReply.displayName = 'DefaultMsgReply';

class Default extends Base {
  getOperation(): MsgOperationItem[] {
    const { info, me } = this.props;

    const operations: MsgOperationItem[] = [];
    operations.push({
      component: <DefaultMsgReply payload={this.props.info} />,
    });
    if (me) {
      // 当消息时自己发起的时候，可以撤回
      operations.push({
        name: '撤回',
        action: ({ dispatch, closePopover }) => {
          dispatch(revokeMsg(info.uuid));
          closePopover();
        },
      });
    }

    return operations;
  }

  getContent() {
    const info = this.props.info || ({} as MsgPayload);
    return (
      <pre className="bubble">
        {this.msgDataManager.hasReplyMsg() && (
          <MsgQuote replyMsg={this.msgDataManager.getReplyMsg()} />
        )}
        <BBCode plainText={info.message} />
        <DefaultAddonContent message={info.message} />
      </pre>
    );
  }
}

export default Default;
