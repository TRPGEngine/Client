import React, { useCallback, useState } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { Iconfont } from '../Iconfont';
import { useTranslation } from '@shared/i18n';
import styled from 'styled-components';
import { openWebviewWindow } from '../StandaloneWindow';
import { Popover } from 'antd';

const ChatOperationBtn = styled.div`
  width: 24px;
  height: 24px;
  background-color: ${({ theme }) => theme.color.transparent90};
  border-radius: 50%;
  color: white;
  line-height: 24px;
  text-align: center;
  cursor: pointer;
`;

const ChatOperationItemContainer = styled.div`
  padding: 6px 10px;
  cursor: pointer;
  border-bottom: ${(props) => props.theme.border.standard};
  font-size: 16px;

  &:hover {
    background-color: ${(props) => props.theme.color.transparent90};
  }

  &:last-child {
    border-bottom: 0;
  }
`;

export const ChatMsgOperation: React.FC<{
  style?: React.CSSProperties;
}> = TMemo((props) => {
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();

  const handleOpenFilePizza = useCallback(() => {
    openWebviewWindow('https://file.pizza/', {
      title: '发送文件',
    });
    // window.open('https://file.pizza');
  }, []);

  const content = (
    <div>
      <ChatOperationItemContainer onClick={handleOpenFilePizza}>
        {t('发送文件')}
      </ChatOperationItemContainer>
    </div>
  );

  return (
    <Popover
      visible={visible}
      onVisibleChange={setVisible}
      overlayClassName="operation-popover"
      placement="top"
      trigger="click"
      arrowContent={null}
      content={content}
    >
      <ChatOperationBtn style={props.style}>
        <Iconfont>&#xe604;</Iconfont>
      </ChatOperationBtn>
    </Popover>
  );
});
ChatMsgOperation.displayName = 'ChatMsgOperation';
