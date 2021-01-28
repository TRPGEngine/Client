import React, { useCallback, Fragment } from 'react';
import type { TRPGDispatch } from '@redux/types/__all__';
import { useMessageItemConfigContext } from '@shared/components/message/MessageItemConfigContext';
import { TMemo } from '@shared/components/TMemo';
import { TPopover, useTPopoverContext } from '@web/components/popover';
import styled from 'styled-components';
import { useTRPGDispatch } from '@shared/hooks/useTRPGSelector';
import _isFunction from 'lodash/isFunction';
import _isNil from 'lodash/isNil';
import _has from 'lodash/has';

import './MsgOperations.less';

interface MsgOperationItemContext {
  dispatch: TRPGDispatch;
  closePopover: () => void;
}

interface MsgOperationNormalItem {
  name: string;
  action: (ctx: MsgOperationItemContext) => void;
}
interface MsgOperationCustomItem {
  component: React.ReactNode;
}
export type MsgOperationItem = MsgOperationNormalItem | MsgOperationCustomItem;

export const MsgOperationListItemContainer = styled.div`
  padding: 4px 10px;
  cursor: pointer;
  border-bottom: ${(props) => props.theme.border.standard};

  &:hover {
    background-color: ${(props) => props.theme.color.transparent90};
  }

  &:last-child {
    border-bottom: 0;
  }
`;
const MsgOperationListItem: React.FC<MsgOperationNormalItem> = TMemo(
  (props) => {
    const dispatch = useTRPGDispatch();
    const { closePopover } = useTPopoverContext();
    const handleClick = useCallback(() => {
      _isFunction(props.action) && props.action({ dispatch, closePopover });
    }, [dispatch, closePopover, props.action]);

    return (
      <MsgOperationListItemContainer onClick={handleClick}>
        {props.name}
      </MsgOperationListItemContainer>
    );
  }
);
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
          {operations.map((op, i) => {
            if ('component' in op) {
              return <Fragment key={i}>{op.component}</Fragment>;
            } else {
              return (
                <MsgOperationListItem
                  key={op.name}
                  name={op.name}
                  action={op.action}
                />
              );
            }
          })}
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
