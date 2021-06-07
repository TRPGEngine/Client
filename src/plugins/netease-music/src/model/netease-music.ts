import { neteaseMusicAPI } from '../config';

interface NeteaseMusicResponse<T = unknown> {
  code: number; // 200
  result: T;
}

interface NeteaseMusicResponseData<T = unknown> {
  code: number; // 200
  data: T;
}

interface NeteaseMusicSearchResult {
  hasMore: boolean;
  songCount: number;
  songs: NeteaseMusicSongInfo[];
}

export interface NeteaseMusicSongInfo {
  album: NeteaseMusicSongAlbum;
  alias: unknown[];
  artists: NeteaseMusicSongAlbumArtist[];
  copyrightId: number;
  duration: number;
  fee: number;
  ftype: number;
  id: number;
  mark: number;
  mvid: number;
  name: string;
  rUrl: unknown;
  rtype: number;
  status: number;
}

interface NeteaseMusicSongAlbum {
  artist: NeteaseMusicSongAlbumArtist;
  copyrightId: number;
  mark: number;
  name: string;
  picId: number;
  publishTime: number;
  size: number;
  status: number;
}

interface NeteaseMusicSongAlbumArtist {
  albumSize: number;
  alias: unknown[];
  id: number;
  img1v1: number;
  img1v1Url: string;
  name: string;
  picId: number;
  picUrl: string | null;
  trans: unknown;
}

interface NeteaseMusicSongDetail {
  br: number;
  canExtend: boolean;
  code: number;
  encodeType: 'mp3'; // maybe have m4a?
  expi: number;
  fee: number;
  flag: number;
  freeTimeTrialPrivilege: {
    resConsumable: boolean;
    userConsumable: boolean;
    type: number;
    remainTime: number;
  };
  freeTrialInfo: unknown;
  freeTrialPrivilege: { resConsumable: boolean; userConsumable: boolean };
  gain: number;
  id: number;
  level: 'normal' | 'exhigh'; // normal, exhigh ...
  md5: string;
  payed: number;
  size: number;
  type: 'mp3';
  uf: unknown;
  url: string;
  urlSource: number;
}

/**
 * 搜索音乐
 */
export async function searchMusicList(keywords: string) {
  const res = await fetch(`${neteaseMusicAPI}/search?keywords=${keywords}`, {
    credentials: 'include',
  });
  const data =
    (await res.json()) as NeteaseMusicResponse<NeteaseMusicSearchResult>;

  return data;
}

/**
 * 获取音乐Url
 */
export async function fetchMusicDetail(songId: number) {
  const res = await fetch(`${neteaseMusicAPI}/song/url?id=${songId}`, {
    credentials: 'include',
  });
  const data = (await res.json()) as NeteaseMusicResponseData<
    NeteaseMusicSongDetail[]
  >;

  return data;
}
