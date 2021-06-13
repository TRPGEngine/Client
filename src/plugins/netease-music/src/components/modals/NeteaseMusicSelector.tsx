/**
 * 网易云音乐发送多媒体卡片
 *
 * 搜索, 选曲, 通过接口获取数据
 */

import React, { useCallback, useState } from 'react';
import { TMemo } from '@capital/shared/components/TMemo';
import { showToasts } from '@capital/shared/manager/ui';
import { Divider, Empty, Input, Tabs } from 'antd';
import {
  NeteaseMusicSongInfo,
  searchMusicList,
} from '../../model/netease-music';
import { ModalWrapper } from '@capital/web/components/Modal';
import { t } from '@capital/shared/i18n';
import _get from 'lodash/get';
import { useMsgSend } from '@capital/shared/redux/hooks/useMsgSend';
// import { NeteaseMusicQRCodeLogin } from '../NeteaseMusicQRCodeLogin';
import { NeteaseMusicCloudList } from '../NeteaseMusicCloudList';
import { SongItem } from '../../components/SongItem';

const Search = Input.Search;

export const NeteaseMusicSelector: React.FC<{
  converseUUID: string;
  onSendMusicCard?: () => void;
}> = TMemo((props) => {
  const { converseUUID, onSendMusicCard } = props;
  const [loading, setLoading] = useState(false);
  const [searchedList, setSearchedList] =
    useState<NeteaseMusicSongInfo[] | null>(null);
  const { sendCardMsg } = useMsgSend(converseUUID);

  const onSearch = useCallback(async (text: string) => {
    try {
      setLoading(true);
      const res = await searchMusicList(text);

      if (res.code !== 200) {
        showToasts(t('搜索音乐失败'), 'error');
        return;
      }
      setSearchedList(res.result.songs);
    } catch (err) {
      console.error(err);
      showToasts(`${t('搜索失败')}: ${String(err)}`, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  const onSendSong = useCallback(
    (songId: number, url: string) => {
      sendCardMsg('media', {
        mediaType: 'audio',
        mediaSource: 'netease',
        mediaUrl: url,
        neteaseSongId: songId,
      });
      showToasts(t('发送成功'), 'success');

      if (typeof onSendMusicCard === 'function') {
        onSendMusicCard();
      }
    },
    [sendCardMsg, onSendMusicCard]
  );

  return (
    <ModalWrapper title={t('网易云音乐')}>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane key="1" tab={t('搜索')}>
          <Search onSearch={onSearch} disabled={loading} />

          <Divider />

          {Array.isArray(searchedList) ? (
            searchedList.length > 0 ? (
              searchedList.map((song) => (
                <SongItem
                  id={song.id}
                  name={song.name}
                  artist={_get(song, ['artists', 0, 'name'], '')}
                  onSendSong={onSendSong}
                />
              ))
            ) : (
              <Empty />
            )
          ) : null}
        </Tabs.TabPane>
        <Tabs.TabPane key="2" tab={t('云盘')}>
          {/* <NeteaseMusicQRCodeLogin /> */}
          <NeteaseMusicCloudList onSendSong={onSendSong} />
        </Tabs.TabPane>
      </Tabs>
    </ModalWrapper>
  );
});
NeteaseMusicSelector.displayName = 'NeteaseMusicSelector';
