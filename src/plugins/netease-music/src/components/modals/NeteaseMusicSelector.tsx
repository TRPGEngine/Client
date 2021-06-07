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
  NeteaseMusicSongInfo,
  searchMusicList,
} from '../../model/netease-music';
import { ModalWrapper } from '@capital/web/components/Modal';
import { t } from '@capital/shared/i18n';
import styled from 'styled-components';
import _get from 'lodash/get';

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

export const NeteaseMusicSelector: React.FC = TMemo(() => {
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
        showToasts(t('搜索音乐失败'), 'error');
      }
    } catch (err) {
      console.error(err);
      showToasts(`${t('搜索失败')}: ${String(err)}`, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleClick = useCallback((songId: number) => {
    console.log('songId', songId);
  }, []);

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
