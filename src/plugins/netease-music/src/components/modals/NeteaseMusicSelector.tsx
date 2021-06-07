/**
 * 网易云音乐发送多媒体卡片
 *
 * 搜索, 选曲, 通过接口获取数据
 */

import React, { useCallback, useState } from 'react';
import { TMemo } from '@capital/shared/components/TMemo';
import { showToasts } from '@capital/shared/manager/ui';
import { Button, Divider, Empty, Input } from 'antd';
import {
  fetchMusicDetail,
  NeteaseMusicSongInfo,
  searchMusicList,
} from '../../model/netease-music';
import { ModalWrapper } from '@capital/web/components/Modal';
import { t } from '@capital/shared/i18n';
import styled from 'styled-components';
import _get from 'lodash/get';
import { useMsgSend } from '@capital/shared/redux/hooks/useMsgSend';

const Search = Input.Search;

const SongItem = styled.div`
  display: flex;

  > .name {
    flex: 1;
  }

  > .action {
    width: 80px;
  }
`;

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

  const handleClick = useCallback(
    async (songId: number) => {
      try {
        setLoading(true);

        const res = await fetchMusicDetail(songId);
        if (res.code !== 200) {
          showToasts(`${t('发送失败')}: 网络异常`, 'error');
          return;
        }

        const detail = _get(res, ['data', 0]);
        const url = detail.url;

        if (typeof url === 'string' && url !== '') {
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
        } else {
          showToasts(
            `${t('发送失败')}: 该音乐可能是一个版权音乐, 无法获取播放地址`,
            'error'
          );
        }
      } catch (err) {
        showToasts(`${t('请求失败')}: ${String(err)}`, 'error');
      } finally {
        setLoading(false);
      }
    },
    [sendCardMsg, onSendMusicCard]
  );

  return (
    <ModalWrapper title={t('网易云音乐')}>
      <Search onSearch={onSearch} disabled={loading} />

      <Divider />

      {Array.isArray(searchedList) ? (
        searchedList.length > 0 ? (
          searchedList.map((song) => (
            <SongItem>
              <div className="name">{song.name}</div>
              <div className="artist">
                {_get(song, ['artists', 0, 'name'], '')}
              </div>
              <div className="action">
                <Button
                  type="link"
                  disabled={loading}
                  onClick={() => handleClick(song.id)}
                >
                  {t('发送')}
                </Button>
              </div>
            </SongItem>
          ))
        ) : (
          <Empty />
        )
      ) : null}
    </ModalWrapper>
  );
});
NeteaseMusicSelector.displayName = 'NeteaseMusicSelector';
