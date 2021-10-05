import React, { useCallback, useState } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { Iconfont } from '../../Iconfont';
import { useTranslation } from '@shared/i18n';
import styled from 'styled-components';
import { Input, Popover, Tabs } from 'antd';
import _isNil from 'lodash/isNil';
import _uniq from 'lodash/uniq';
import { useLocalStorage } from 'react-use';
import {
  ChatEmotionItem,
  searchEmotionWithKeyword,
} from '@shared/model/chat-emotion';
import Image from '../../Image';
import Loading from '@portal/components/Loading';
import { ChatBoxBtn } from '../style';
import { trackEvent } from '@web/utils/analytics-helper';

const { TabPane } = Tabs;
const { Search } = Input;

const ChatEmotionPopoverContainer = styled.div`
  width: 350px;
  height: 280px;
`;

const ChatEmotionSearchResultList = styled.div`
  width: 100%;
  height: 200px;
  overflow-y: auto;
  padding: 4px;

  > img {
    width: 25%;
  }
`;

const ChatEmotionPanelContainer = styled.div`
  height: 100%;
  width: 100%;
  margin-top: -16px;
`;

function useSearchEmotion() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResultList, setSearchResultList] = useState<ChatEmotionItem[]>(
    []
  );
  const [searching, setSearching] = useState(false);

  const handleSearch = useCallback(async () => {
    if (searching === true) {
      return;
    }

    setSearching(true);
    trackEvent('chat:searchEmotion', { searchKeyword });

    const list = await searchEmotionWithKeyword(searchKeyword);
    setSearchResultList(list);
    setSearching(false);
  }, [searchKeyword, searching]);

  return {
    searchKeyword,
    setSearchKeyword,
    searchResultList,
    handleSearch,
    searching,
  };
}

export const ChatMsgEmotion: React.FC<{
  onSelectEmotion: (emotionUrl: string) => void;
  style?: React.CSSProperties;
}> = TMemo((props) => {
  const { onSelectEmotion } = props;
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();
  const [tabKey, setTabKey] = useLocalStorage('__emotion_tab', '1');
  const [emotionRecent = [], setEmotionRecent] = useLocalStorage<string[]>(
    '__emotion_recent',
    []
  );
  const {
    searchKeyword,
    setSearchKeyword,
    searchResultList,
    handleSearch,
    searching,
  } = useSearchEmotion();

  const handleAddRecentEmotion = useCallback(
    (imageUrl) => {
      let newArr = [imageUrl, ...emotionRecent];
      newArr = _uniq(newArr).slice(0, 8); // 去重后最多只保留8条
      setEmotionRecent(newArr);
    },
    [emotionRecent]
  );

  const handleSelectImage = useCallback(
    (imageUrl: string) => {
      setVisible(false);
      handleAddRecentEmotion(imageUrl);

      typeof onSelectEmotion === 'function' && onSelectEmotion(imageUrl);
    },
    [handleAddRecentEmotion, onSelectEmotion]
  );

  const content = (
    <ChatEmotionPopoverContainer>
      <Tabs
        activeKey={tabKey}
        onChange={setTabKey}
        tabBarStyle={{ padding: '0 10px' }}
      >
        <TabPane tab={t('最近')} key="1">
          <ChatEmotionPanelContainer>
            <ChatEmotionSearchResultList>
              {emotionRecent.map((url, i) => {
                return (
                  <Image
                    key={i + url}
                    style={{ cursor: 'pointer' }}
                    src={url}
                    onClick={() => handleSelectImage(url)}
                  />
                );
              })}
            </ChatEmotionSearchResultList>
          </ChatEmotionPanelContainer>
        </TabPane>
        <TabPane tab={t('搜索表情')} key="2">
          <ChatEmotionPanelContainer>
            <Search
              style={{ width: '100%' }}
              placeholder={t('关键字')}
              onSearch={handleSearch}
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              disabled={searching}
            />

            <ChatEmotionSearchResultList>
              {searching ? (
                <Loading />
              ) : (
                searchResultList.map((item) => {
                  return (
                    <Image
                      key={item.url}
                      style={{ cursor: 'pointer' }}
                      src={item.url}
                      onClick={() => handleSelectImage(item.url)}
                    />
                  );
                })
              )}
            </ChatEmotionSearchResultList>
          </ChatEmotionPanelContainer>
        </TabPane>
      </Tabs>
    </ChatEmotionPopoverContainer>
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
      <ChatBoxBtn style={props.style}>
        <Iconfont>&#xe683;</Iconfont>
      </ChatBoxBtn>
    </Popover>
  );
});
ChatMsgEmotion.displayName = 'ChatMsgEmotion';
