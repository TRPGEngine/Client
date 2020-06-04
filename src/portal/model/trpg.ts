import { request } from '@portal/utils/request';
import { ChatLogItem } from './chat';
import { hpack, hunpack } from '@shared/utils/json-helper';
import _isNil from 'lodash/isNil';

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

export interface RecruitItemType {
  uuid: string;
  title: string;
  author: string;
  content: string;
  platform: 'trpgengine' | 'qq' | 'other';
  contact_type: 'user' | 'group';
  contact_content: string;
  updatedAt: string;
  completed: boolean;
}
