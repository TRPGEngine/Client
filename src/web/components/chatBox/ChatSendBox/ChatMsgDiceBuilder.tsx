import React, { useCallback, useState } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { Editor } from 'slate';
import { Iconfont } from '@web/components/Iconfont';
import { Button, Divider, Popover, Tooltip } from 'antd';
import { ChatBoxBtn } from '../style';
import _isNil from 'lodash/isNil';

interface ChatMsgDiceBuilderProps {
  editorRef: React.MutableRefObject<Editor | undefined>;
  onSelectDice: (express: string) => void;
}
export const ChatMsgDiceBuilder: React.FC<ChatMsgDiceBuilderProps> = TMemo(
  (props) => {
    const { editorRef, onSelectDice } = props;
    const [visible, setVisible] = useState(false);

    const handleSendDice = useCallback(
      (expressStr: string) => {
        onSelectDice(expressStr);
        setVisible(false);
      },
      [onSelectDice]
    );

    const content = (
      <div>
        {/* TODO: 常用骰 */}

        {/* <Divider /> */}

        {/* 默认骰 */}
        <Tooltip title="1d4">
          <Button
            icon={
              <Iconfont onClick={() => handleSendDice('.r1d4')}>
                &#xe626;
              </Iconfont>
            }
          />
        </Tooltip>
        <Tooltip title="1d6">
          <Button
            icon={
              <Iconfont onClick={() => handleSendDice('.r1d6')}>
                &#xe628;
              </Iconfont>
            }
          />
        </Tooltip>
        <Tooltip title="1d8">
          <Button
            icon={
              <Iconfont onClick={() => handleSendDice('.r1d8')}>
                &#xe627;
              </Iconfont>
            }
          />
        </Tooltip>
        <Tooltip title="1d10">
          <Button
            icon={
              <Iconfont onClick={() => handleSendDice('.r1d10')}>
                &#xe62b;
              </Iconfont>
            }
          />
        </Tooltip>
        <Tooltip title="1d12">
          <Button
            icon={
              <Iconfont onClick={() => handleSendDice('.r1d12')}>
                &#xe62a;
              </Iconfont>
            }
          />
        </Tooltip>
        <Tooltip title="1d20">
          <Button
            icon={
              <Iconfont onClick={() => handleSendDice('.r1d20')}>
                &#xe629;
              </Iconfont>
            }
          />
        </Tooltip>
        <Tooltip title="1d100">
          <Button
            icon={
              <Iconfont onClick={() => handleSendDice('.r1d100')}>
                &#xe62c;
              </Iconfont>
            }
          />
        </Tooltip>
      </div>
    );

    return (
      <Popover
        visible={visible}
        onVisibleChange={setVisible}
        overlayClassName="chat-sendbox-addon-popover"
        placement="topRight"
        trigger="click"
        content={content}
      >
        <ChatBoxBtn>
          <Iconfont>&#xe629;</Iconfont>
        </ChatBoxBtn>
      </Popover>
    );
  }
);
ChatMsgDiceBuilder.displayName = 'ChatMsgDiceBuilder';
