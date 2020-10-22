import { request } from '@portal/utils/request';
import { hpack, hunpack } from '@shared/utils/json-helper';
import _isNil from 'lodash/isNil';
import _isEmpty from 'lodash/isEmpty';
import { ReportLogItem } from '@shared/model/trpg';

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
