import React, { useContext, useCallback } from 'react';
import { TRPGDispatch } from '@redux/types/__all__';
import { useMessageItemConfigContext } from '@shared/components/message/MessageItemConfigContext';
import { TMemo } from '@shared/components/TMemo';
import { TPopover, TPopoverContext } from '@web/components/popover';
import styled from 'styled-components';
import { useTRPGDispatch } from '@shared/hooks/useTRPGSelector';
import _isFunction from 'lodash/isFunction';

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
 * 渲染消息操作列表
 */
export const MsgOperations: React.FC<{
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
MsgOperations.displayName = 'MsgOperations';
