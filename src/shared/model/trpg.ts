import type { ChatLogItem } from '@shared/model/chat';
import { hpack, hunpack } from '@shared/utils/json-helper';
import { request } from '@shared/utils/request';
import _isNil from 'lodash/isNil';
import _isEmpty from 'lodash/isEmpty';

export interface GameReport {
  uuid: string;
  title: string;
  cast: any;
  groupUUID: string;
  content: {
    playerUUID: string;
    logs: ReportLogItem[];
  };
}

export type GameReportSimple = Pick<GameReport, 'uuid' | 'title' | 'groupUUID'>;

// 消息log必须的字段
// 用于消息数据压缩
export const reportLogRequireKey = [
  'uuid',
  'sender_uuid',
  'message',
  'type',
  'date',
  'data',
  'revoke',
] as const;

export type ReportLogItem = Pick<
  ChatLogItem,
  typeof reportLogRequireKey[number]
>;
export interface EditLogItem extends ReportLogItem {
  selected: boolean;
}
export interface DetailLogItem extends ReportLogItem {
  isShow: boolean;
}

/**
 * 创建游戏战报
 * @param title 标题
 * @param playerUUID 战报主视角的UUID
 * @param groupUUID 战报选择团的UUID
 * @param logs 记录
 */
export const createTRPGGameReport = async (
  title: string,
  playerUUID: string,
  groupUUID: string,
  logs: ReportLogItem[]
): Promise<string> => {
  const { data } = await request.post('/trpg/game-report/create', {
    title,
    groupUUID,
    content: { playerUUID, logs: hpack(logs) },
  });

  return data.uuid;
};

/**
 * 获取团战报列表
 * @param groupUUID 团UUID
 */
export async function fetchGroupReport(
  groupUUID: string
): Promise<GameReportSimple[]> {
  const { data } = await request.get(
    `/trpg/game-report/group/${groupUUID}/list`
  );

  return data.list;
}

/**
 * 移除团战报
 * @param reportUUID 战报UUID
 * @param groupUUID 团UUID
 */
export async function deleteGroupReport(reportUUID: string, groupUUID: string) {
  await request.post('/trpg/game-report/delete', {
    reportUUID,
    groupUUID,
  });
}

/**
 * 获取团战报
 * @param uuid UUID
 */
export async function fetchTRPGGameReport(uuid: string): Promise<GameReport> {
  const { data } = await request.get(`/trpg/game-report/${uuid}`);

  const report = data.report;
  if (!_isNil(report.content)) {
    report.content.logs = hunpack(report.content.logs);
  }

  return report;
}

/**
 * 获取自己的战报
 */
export const fetchOwnReport = async (): Promise<GameReport[]> => {
  const { data } = await request.get('/trpg/game-report/list');

  const reports = data.reports;

  return reports;
};

export type RecruitPlatform = 'trpgengine' | 'qq' | 'other';
export type RecruitContactType = 'user' | 'group';
export interface RecruitItemType {
  uuid: string;
  title: string;
  author: string;
  content: string;
  platform: RecruitPlatform;
  contact_type: RecruitContactType;
  contact_content: string;
  updatedAt: string;
  completed: boolean;
}

/**
 * 值与显示的映射
 */
export const recruitPlatformMap = {
  trpgengine: 'TRPG Engine',
  qq: 'QQ',
  other: '其他',
};
export const recruitContactTypeMap = {
  user: '用户',
  group: '群组',
};

/**
 * 创建一条招募信息
 * @param title 标题
 * @param content 内容
 * @param platform 平台
 * @param contactType 联系类型
 * @param contactContent 联系方式
 */
export const createRecruit = async (
  title: string,
  content: string,
  platform: RecruitPlatform,
  contactType: RecruitContactType,
  contactContent: string
): Promise<void> => {
  if (_isEmpty(title) || _isEmpty(content)) {
    throw new Error('缺少必要字段');
  }

  await request.post(`/trpg/recruit/create`, {
    title,
    content,
    platform,
    contactType,
    contactContent,
  });
};

/**
 * 获取所有招募列表
 */
export async function fetchAllRecruitList(): Promise<RecruitItemType[]> {
  const { data } = await request.get('/trpg/recruit/list/all');

  const list = data.list;

  return list;
}

/**
 * 获取用户招募列表
 */
export async function fetchUserRecruitList(): Promise<RecruitItemType[]> {
  const { data } = await request.get('/trpg/recruit/list/user');

  const list = data.list;

  return list;
}

/**
 * 设置招募已完成
 * @param recruitUUID 招募UUID
 */
export async function setRecruitCompleted(recruitUUID: string): Promise<void> {
  await request.post(`/trpg/recruit/${recruitUUID}/complete`);
}

/**
 * 获取招募详情
 * @param recruitUUID 招募UUID
 */
export async function fetchUserRecruitDetail(
  recruitUUID: string
): Promise<RecruitItemType> {
  const { data } = await request.get(`/trpg/recruit/${recruitUUID}`);

  const recruit = data.recruit;

  return recruit;
}
