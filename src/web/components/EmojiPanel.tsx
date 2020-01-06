import React, { useCallback } from 'react';
import 'emoji-mart/css/emoji-mart.css';
import { Picker, EmojiData } from 'emoji-mart';
import styled from 'styled-components';
import _isFunction from 'lodash/isFunction';

const Container = styled.div`
  .emoji-mart-emoji {
    outline: 0;
  }
`;

interface Props {
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onSelect?: (code: string) => void;
}

const EmojiPanel: React.FC<Props> = React.memo((props) => {
  const onSelect = useCallback((emoji: EmojiData) => {
    const code = emoji.colons;
    _isFunction(props.onSelect) && props.onSelect(code);
  }, []);

  return (
    <Container onClick={props.onClick}>
      <Picker
        title="TRPG Engine Emoji"
        style={props.style}
        showPreview={false}
        showSkinTones={false}
        native={true}
        onSelect={onSelect}
      />
    </Container>
  );
});
EmojiPanel.displayName = 'EmojiPanel';

export default EmojiPanel;
