import React, { useCallback, useState } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { Iconfont } from '../Iconfont';
import { useTranslation } from '@shared/i18n';
import styled from 'styled-components';
import { openWebviewWindow } from '../StandaloneWindow';
import { Popover } from 'antd';
import { FileSelector } from '../FileSelector';
import _isNil from 'lodash/isNil';
import { uploadChatimg } from '@shared/utils/image-uploader';
import { Editor } from 'slate';
import { insertImage } from '../editor/changes/insertImage';
import { showGlobalLoading, showToasts } from '@shared/manager/ui';

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
  editorRef: React.MutableRefObject<Editor | undefined>;
  style?: React.CSSProperties;
}> = TMemo((props) => {
  const { editorRef } = props;
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();

  const handleOpenFilePizza = useCallback(() => {
    setVisible(false);
    openWebviewWindow('https://file.pizza/', {
      title: '发送文件',
    });
  }, []);

  const handleSelectFiles = useCallback(
    async (files: FileList) => {
      setVisible(false);
      if (_isNil(editorRef.current)) {
        return;
      }

      const file = files[0];
      if (_isNil(file)) {
        return;
      }

      const hideLoading = showGlobalLoading(t('正在上传图片...'));
      try {
        const chatimgUrl = await uploadChatimg(file);
        insertImage(editorRef.current, chatimgUrl);
      } catch (err) {
        showToasts(err, 'error');
      } finally {
        hideLoading();
      }
    },
    [t]
  );

  const content = (
    <div>
      <FileSelector
        fileProps={{ accept: 'image/*' }}
        onSelected={handleSelectFiles}
      >
        <ChatOperationItemContainer>{t('发送图片')}</ChatOperationItemContainer>
      </FileSelector>
      <ChatOperationItemContainer onClick={handleOpenFilePizza}>
        {t('发送文件')}
      </ChatOperationItemContainer>
    </div>
  );

  return (
    <Popover
      visible={visible}
      onVisibleChange={setVisible}
      overlayClassName="chat-sendbox-addon-popover"
      placement="top"
      trigger="click"
      content={content}
    >
      <ChatOperationBtn style={props.style}>
        <Iconfont>&#xe604;</Iconfont>
      </ChatOperationBtn>
    </Popover>
  );
});
ChatMsgOperation.displayName = 'ChatMsgOperation';
