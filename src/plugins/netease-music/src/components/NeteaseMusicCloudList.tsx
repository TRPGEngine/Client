import React from 'react';
import useSWR from 'swr';
import { TMemo } from '@capital/shared/components/TMemo';
import { UserCloudMusicListResp, musicFetcher } from '../model/netease-music';
import LoadingSpinner from '@capital/web/components/LoadingSpinner';
import { SongItem } from './SongItem';
import _get from 'lodash/get';
import { Empty } from 'antd';
import { NeteaseEnsureLoginView } from './NeteaseEnsureLoginView';

interface Props {
  onSendSong: (songId: number, url: string) => void;
}

const NeteaseMusicCloudSongs: React.FC<Props> = TMemo((props) => {
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
NeteaseMusicCloudSongs.displayName = 'NeteaseMusicCloudSongs';

export const NeteaseMusicCloudList: React.FC<Props> = TMemo((props) => {
  return (
    <NeteaseEnsureLoginView>
      <NeteaseMusicCloudSongs {...props} />
    </NeteaseEnsureLoginView>
  );
});
NeteaseMusicCloudList.displayName = 'NeteaseMusicCloudList';
