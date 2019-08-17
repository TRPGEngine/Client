/**
 * 表情包面板
 * for ChatScreen
 */

import React from 'react';
import { Text } from 'react-native';
import { connect } from 'react-redux';
import immutable from 'immutable';
import styled from 'styled-components/native';
import { Icon, Carousel, Modal } from '@ant-design/react-native';
import Emoji from 'react-native-emoji';
import FastImage from 'react-native-fast-image';
import { emojiMap, emojiCatalog } from '../../utils/emoji';
import config from '../../../../config/project.config';
import _get from 'lodash/get';
import _chunk from 'lodash/chunk';
import { addUserEmotionCatalogWithSecretSignal } from '../../../redux/actions/chat';

const EMOJI_PANEL_HEIGHT = 190; // 表情面板高度

const EmoticonPanel = styled.View`
  height: ${EMOJI_PANEL_HEIGHT};
  background-color: white;
  border-top-width: 1px;
  border-top-color: #ccc;
`;

const EmotionCarousel = styled(Carousel)`
  height: ${EMOJI_PANEL_HEIGHT - 35};
`;

const EmoticonCatalog = styled.ScrollView.attrs({
  horizontal: true,
})`
  height: 35px;
  flex-direction: row;
  border-top-width: 0.5;
  border-top-color: #eee;
`;

const EmoticonCatalogItem = styled.TouchableOpacity<{ isSelected?: boolean }>`
  padding: 0 10px;
  border-right-width: 0.5px;
  border-right-color: #eee;
  background-color: ${(props) => (props.isSelected ? '#ccc' : 'white')};
  justify-content: center;
`;

const EmotionPageView = styled.View`
  flex-direction: column;
  height: ${EMOJI_PANEL_HEIGHT - 35 - 30};
`;

const EmojiPageRow = styled.View`
  flex-direction: row;
  padding: 0 10px;
  height: ${100 / 3}%;
`;

const EmojiItem = styled.TouchableOpacity`
  width: ${100 / 7}%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const EmojiText = styled.Text`
  text-align: center;
  font-size: 18;
  color: #333;
`;

const EmotionPageRow = styled.View`
  flex-direction: row;
  padding: 0 10px;
  height: ${100 / 2}%;
`;

const EmotionItem = styled.TouchableOpacity`
  width: ${100 / 4}%;
  height: 100%;
  justify-content: center;
  align-items: center;
  padding: 2px;
`;

const EmotionItemImage = styled(FastImage)`
  width: 100%;
  height: 100%;
`;

interface Props {
  dispatch: any;
  emotionCatalog: immutable.List<any>;
  onSelectEmoji: (code: string) => void;
  onSelectEmotion: (emotionUrl: string) => void;
}

class EmotionPanel extends React.Component<Props> {
  state = {
    selectedEmotionCatalog: emojiCatalog[0],
  };

  /**
   * 点击增加表情包功能
   */
  handleAddEmotionCatalog() {
    Modal.operation([
      {
        text: '通过暗号添加表情包',
        onPress: () => {
          // 打开输入框
          Modal.prompt('表情包暗号', '请输入暗号，大小写任意', (message) => {
            this.props.dispatch(addUserEmotionCatalogWithSecretSignal(message));
          });
        },
      },
    ]);
  }

  render() {
    const selectedEmotionCatalog = this.state.selectedEmotionCatalog;
    const isEmoji = Object.keys(emojiMap).includes(selectedEmotionCatalog); // 监测是否为emoji表情

    // 返回当前页的emoji表情列表
    const getEmojiPage = () => {
      const emojis = _get(emojiMap, selectedEmotionCatalog, []).map(
        ({ name, code }, index) => {
          return (
            <EmojiItem
              key={name + index}
              onPress={() => this.props.onSelectEmoji(code)}
            >
              <EmojiText>
                <Emoji name={name} />
              </EmojiText>
            </EmojiItem>
          );
        }
      );

      const rowNum = 3;
      const colNum = 7;
      const emojiPages = _chunk(emojis, rowNum * colNum);

      return emojiPages.map((emojiPage, index) => {
        const rows = _chunk(emojiPage, colNum);

        return (
          <EmotionPageView key={selectedEmotionCatalog + index}>
            {rows.map((emojis, i) => (
              <EmojiPageRow key={i}>{emojis}</EmojiPageRow>
            ))}
          </EmotionPageView>
        );
      });
    };

    // 返回当前页的表情包
    const getEmotionPage = () => {
      // 该表情包下所有表情
      const items: any[] = this.props.emotionCatalog
        .find((catalog) => catalog.get('uuid') === selectedEmotionCatalog)
        .get('items')
        .toJS();

      const rowNum = 2;
      const colNum = 4;
      const pages = _chunk(items, rowNum * colNum);

      return pages.map((page, index) => {
        const rows = _chunk(page, colNum);

        return (
          <EmotionPageView key={selectedEmotionCatalog + index}>
            {rows.map((items, i) => (
              <EmotionPageRow key={i}>
                {items.map((item, _i) => {
                  const imageUrl = config.file.getAbsolutePath(item.url);

                  return (
                    <EmotionItem
                      key={_i}
                      onPress={() => this.props.onSelectEmotion(imageUrl)}
                    >
                      <EmotionItemImage
                        source={{ uri: imageUrl }}
                        resizeMode={FastImage.resizeMode.contain}
                      />
                    </EmotionItem>
                  );
                })}
              </EmotionPageRow>
            ))}
          </EmotionPageView>
        );
      });
    };

    return (
      <EmoticonPanel>
        <EmotionCarousel key={selectedEmotionCatalog}>
          {isEmoji ? getEmojiPage() : getEmotionPage()}
        </EmotionCarousel>
        <EmoticonCatalog>
          <EmoticonCatalogItem onPress={() => this.handleAddEmotionCatalog()}>
            <EmojiText>
              <Text>+</Text>
            </EmojiText>
          </EmoticonCatalogItem>
          {/* emoji表情包 */}
          {emojiCatalog.map((catalog) => {
            const { name, code } = _get(emojiMap, [catalog, 0]); // 取目录第一个表情作为目录图标

            return (
              <EmoticonCatalogItem
                key={catalog + name}
                isSelected={selectedEmotionCatalog === catalog}
                onPress={() =>
                  this.setState({ selectedEmotionCatalog: catalog })
                }
              >
                <EmojiText>
                  <Emoji name={name} />
                </EmojiText>
              </EmoticonCatalogItem>
            );
          })}
          {/* 自定义表情包 */}
          {this.props.emotionCatalog.map((catalog) => {
            const catalogUUID = catalog.get('uuid');

            return (
              <EmoticonCatalogItem
                key={catalogUUID}
                isSelected={selectedEmotionCatalog === catalogUUID}
                onPress={() =>
                  this.setState({ selectedEmotionCatalog: catalogUUID })
                }
              >
                <Icon name="star" color="#999" />
              </EmoticonCatalogItem>
            );
          })}
        </EmoticonCatalog>
      </EmoticonPanel>
    );
  }
}

export default connect((state: immutable.Map<string, any>) => ({
  emotionCatalog: state.getIn(['chat', 'emotions', 'catalogs'], []),
}))(EmotionPanel);
