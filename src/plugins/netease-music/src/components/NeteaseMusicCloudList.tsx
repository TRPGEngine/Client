import React, { useEffect } from 'react';
import useSWR from 'swr';
import { TMemo } from '@capital/shared/components/TMemo';
import { UserCloudMusicListResp, musicFetcher } from '../model/netease-music';
import LoadingSpinner from '@capital/web/components/LoadingSpinner';
import { SongItem } from './SongItem';
import _get from 'lodash/get';
import { Empty } from 'antd';

interface Props {
  onSendSong: (songId: number, url: string) => void;
}
export const NeteaseMusicCloudList: React.FC<Props> = TMemo((props) => {
  const { onSendSong } = props;
  const { data: resp, isValidating } = useSWR<UserCloudMusicListResp>(
    '/user/cloud',
    musicFetcher
  );

  if (isValidating) {
    return <LoadingSpinner />;
  }

  const list = resp?.data ?? [];

  if (list.length === 0) {
    return <Empty />;
  }

  return (
    <div>
      {list.map((item) => (
        <SongItem
          id={item.songId}
          name={item.songName}
          onSendSong={onSendSong}
        />
      ))}
    </div>
  );
});
NeteaseMusicCloudList.displayName = 'NeteaseMusicCloudList';
