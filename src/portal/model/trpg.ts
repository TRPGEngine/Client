import { request } from '@portal/utils/request';
import { ChatLogItem } from './chat';
import { hpack, hunpack } from '@shared/utils/json-helper';
import _isNil from 'lodash/isNil';

export const reportLogRequireKey = [
  'uuid',
  'sender_uuid',
  'message',
  'type',
  'data',
  'revoke',
] as const; // 消息log必须的字段
export interface ReportLogItem
  extends Pick<ChatLogItem, typeof reportLogRequireKey[number]> {
  selected: boolean;
}

export interface GameReport {
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
