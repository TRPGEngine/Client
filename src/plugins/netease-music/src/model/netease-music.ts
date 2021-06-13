import { neteaseMusicAPI } from '../config';
import _get from 'lodash/get';
import axios from 'axios';

const request = axios.create({
  baseURL: neteaseMusicAPI,
  withCredentials: true,
});

/**
 * 网易云音乐获取器
 * 用于SWR
 */
export const musicFetcher = (url: string) =>
  request.get(url).then((res) => res.data);

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

export interface UserCloudMusicListResp {
  code: number;
  count: number;
  data: CloudMusicListItem[];
  hasMore: boolean;
  maxSize: string;
  size: string;
  upgradeSign: number;
}

interface CloudMusicListItem {
  addTime: number;
  album: string;
  artist: string;
  bitrate: number;
  cover: number;
  coverId: string;
  fileName: string;
  fileSize: number;
  lyricId: string;
  simpleSong: unknown;
  songId: number;
  songName: string;
  version: number;
}

/**
 * 网易云音乐用户信息
 */
export interface UserAccount {
  id: number;
  userName: string;
  type: number;
  status: number;
  whitelistAuthority: number;
  createTime: number;
  tokenVersion: number;
  ban: number;
  baoyueVersion: number;
  donateVersion: number;
  vipType: number;
  anonimousUser: boolean;
  paidFee: boolean;
}

export interface UserProfile {
  userId: number;
  userType: number;
  nickname: string;
  avatarImgId: number;
  avatarUrl: string;
  backgroundImgId: number;
  backgroundUrl: string;
  signature: unknown;
  createTime: number;
  userName: string;
  accountType: number;
  shortUserName: string;
  birthday: number;
  authority: number;
  gender: number;
  accountStatus: number;
  province: number;
  city: number;
  authStatus: number;
  description: unknown;
  detailDescription: unknown;
  defaultAvatar: boolean;
  expertTags: unknown;
  experts: unknown;
  djStatus: number;
  locationStatus: number;
  vipType: number;
  followed: boolean;
  mutual: boolean;
  authenticated: boolean;
  lastLoginTime: number;
  lastLoginIP: string;
  remarkName: unknown;
  viptypeVersion: number;
  authenticationTypes: number;
  avatarDetail: unknown;
  anchor: boolean;
}

/**
 * 搜索音乐
 */
export async function searchMusicList(keywords: string) {
  const { data } = await request.get<
    NeteaseMusicResponse<NeteaseMusicSearchResult>
  >(`/search?keywords=${keywords}`);

  return data;
}

/**
 * 获取音乐Url
 */
export async function fetchMusicDetail(songId: number) {
  const { data } = await request.get<
    NeteaseMusicResponseData<NeteaseMusicSongDetail[]>
  >(`/song/url?id=${songId}`);

  return data;
}

/**
 * 生成扫描二维码登录的地址
 */
export async function generateLoginQRCodeUrl(): Promise<{
  unikey: string;
  qrurl: string;
}> {
  const { data: keyData } = await request.get(`/login/qr/key?_=${Date.now()}`);
  const unikey: string = _get(keyData, 'data.unikey');

  if (typeof unikey !== 'string') {
    throw new Error('无法生成登录二维码key');
  }

  const { data: qrData } = await request.get(
    `/login/qr/create?key=${unikey}&_=${Date.now()}`
  );
  const qrurl: string = _get(qrData, 'data.qrurl');
  if (typeof qrurl !== 'string') {
    throw new Error('无法生成登录二维码url');
  }

  console.log('qrurl', qrurl);

  return { unikey, qrurl };
}

/**
 * 检查二维码登录状态
 *
 * 二维码扫码状态:
 *  800为二维码过期
 *  801为等待扫码
 *  802为待确认
 *  803为授权登录成功(803状态码下会返回cookies)
 */
export async function checkLoginQRCodeStatus(unikey: string) {
  const { data } = await request.get(
    `/login/qr/check?key=${unikey}&_=${Date.now()}`
  );
  const { code, message, cookie } = data;

  return { code, message };
}

/**
 * 获取用户状态
 */
export async function fetchUserLoginStatus(): Promise<any> {
  const { data } = await request.get(`/login/status?_=${Date.now()}`);

  return data.data;
}

/**
 * 退出登录
 */
export async function logout(): Promise<any> {
  await request.get(`/logout?_=${Date.now()}`);
}
