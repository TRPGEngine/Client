import { TMemo } from '@capital/shared/components/TMemo';
import { fetchMusicDetail, NeteaseMusicSongInfo } from '../model/netease-music';
import React, { useCallback, useState } from 'react';
import { t } from '@capital/shared/i18n';
import { Button } from 'antd';
import _get from 'lodash/get';
import styled from 'styled-components';
import { showToasts } from '@capital/shared/manager/ui';

const SongItemContainer = styled.div`
  display: flex;

  > .name {
    flex: 1;
  }

  > .action {
    width: 80px;
  }
`;

interface Props {
  id: number;
  name: string;
  artist?: string;
  onSendSong: (songId: number, songUrl: string) => void;
}
export const SongItem: React.FC<Props> = TMemo((props) => {
  const { id, name, artist = '', onSendSong } = props;
  const [loading, setLoading] = useState(false);

  const handleClick = useCallback(
    async (songId: number) => {
      try {
        setLoading(true);

        const res = await fetchMusicDetail(songId);
        if (res.code !== 200) {
          showToasts(`${t('获取音乐失败')}: 网络异常`, 'error');
          return;
        }

        const detail = _get(res, ['data', 0]);
        const url = detail.url;

        if (typeof url === 'string' && url !== '') {
          onSendSong(songId, url);
        } else {
          showToasts(
            `${t('获取音乐失败')}: ${t(
              '该音乐可能是一个版权音乐, 无法获取播放地址'
            )} `,
            'error'
          );
        }
      } catch (err) {
        showToasts(`${t('请求失败')}: ${String(err)}`, 'error');
      } finally {
        setLoading(false);
      }
    },
    [onSendSong]
  );

  return (
    <SongItemContainer>
      <div className="name">{name}</div>
      <div className="artist">{artist ?? ''}</div>
      <div className="action">
        <Button type="link" disabled={loading} onClick={() => handleClick(id)}>
          {t('发送')}
        </Button>
      </div>
    </SongItemContainer>
  );
});
SongItem.displayName = 'SongItem';
