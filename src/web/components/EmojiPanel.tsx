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

const i18n = {
  search: '搜索',
  clear: '清除', // Accessible label on "clear" button
  notfound: '没有找到表情',
  categories: {
    search: '搜索结果',
    recent: '最近使用',
    people: '人物',
    nature: '自然',
    foods: '食物',
    activity: '活动',
    places: '地点',
    objects: '物体',
    symbols: '标志',
    flags: '旗帜',
    custom: '自定义',
  },
  categorieslabel: '表情目录', // Accessible title for the list of categories
};

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
        i18n={i18n}
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
