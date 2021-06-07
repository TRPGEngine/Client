/**
 * 网易云音乐发送多媒体卡片
 *
 * 搜索, 选曲, 通过接口获取数据
 */

import React, { useCallback, useState } from 'react';
import { TMemo } from '@capital/shared/components/TMemo';
import { ChatBoxBtn } from '@capital/web/components/chatBox/style';
import { showToasts } from '@capital/shared/manager/ui';
import { Button, Empty, Input, Popover } from 'antd';
import {
  NeteaseMusicSongInfo,
  searchMusicList,
} from '../../../model/netease-music';
import logo from '../../../../assets/netease-music.svg';

const Search = Input.Search;

export const ChatNeteaseMusicSendBox: React.FC = TMemo(() => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchedList, setSearchedList] =
    useState<NeteaseMusicSongInfo[] | null>(null);

  const onSearch = useCallback(async (text: string) => {
    try {
      setLoading(true);
      const res = await searchMusicList(text);

      if (res.code === 200) {
        setSearchedList(res.result.songs);
      } else {
        showToasts('搜索音乐失败', 'error');
      }
    } catch (err) {
      console.error(err);
      showToasts('搜索失败:' + String(err), 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleClick = useCallback((songId: number) => {
    console.log('songId', songId);
  }, []);

  const content = (
    <div>
      <Search onSearch={onSearch} disabled={loading} />

      {Array.isArray(searchedList) ? (
        searchedList.length > 0 ? (
          searchedList.map((song) => (
            <div>
              <div>{song.name}</div>
              <div>
                <Button onClick={() => handleClick(song.id)}>发送</Button>
              </div>
            </div>
          ))
        ) : (
          <Empty />
        )
      ) : null}
    </div>
  );

  return (
    <Popover
      visible={visible}
      onVisibleChange={setVisible}
      placement="topRight"
      trigger="click"
      content={content}
    >
      <ChatBoxBtn>
        <img src={logo} />
      </ChatBoxBtn>
    </Popover>
  );
});
ChatNeteaseMusicSendBox.displayName = 'ChatNeteaseMusicSendBox';
