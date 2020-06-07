import { request } from '@portal/utils/request';
import { ChatLogItem } from './chat';
import { hpack, hunpack } from '@shared/utils/json-helper';
import _isNil from 'lodash/isNil';
import _isEmpty from 'lodash/isEmpty';

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

export interface GameReport {
  uuid: string;
  title: string;
  cast: any;
  content: {
    playerUUID: string;
    logs: ReportLogItem[];
  };
}

/**
 * 创建游戏战报
 * @param title 标题
 * @param playerUUID 战报主视角的UUID
 * @param logs 记录
 */
export const createTRPGGameReport = async (
  title: string,
  playerUUID: string,
  logs: ReportLogItem[]
): Promise<string> => {
  const { data } = await request.post('/trpg/game-report/create', {
    title,
    content: { playerUUID, logs: hpack(logs) },
  });

  return data.uuid;
};

/**
 * 获取团战报
 * @param uuid UUID
 */
export const fetchTRPGGameReport = async (
  uuid: string
): Promise<GameReport> => {
  const { data } = await request.get(`/trpg/game-report/${uuid}`);

  const report = data.report;
  if (!_isNil(report.content)) {
    report.content.logs = hunpack(report.content.logs);
  }

  return report;
};

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

export async function fetchRecruitList(): Promise<RecruitItemType[]> {
  const { data } = await request.get('/trpg/recruit/list');

  const list = data.list;

  return list;
}
