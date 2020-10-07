import { request } from '@shared/utils/request';

export interface MsgTokenBot {
  token: string;
  name: string;
  group_uuid: string;
  channel_uuid: string | null;
}

/**
 * 创建简单机器人
 */
export async function createMsgTokenBot(
  name: string,
  groupUUID: string,
  channelUUID: string | null
): Promise<MsgTokenBot> {
  const { data } = await request.post('/bot/msg/token/create', {
    name,
    groupUUID,
    channelUUID,
  });

  return data.bot;
}

/**
 * 移除简单机器人
 */
export async function removeMsgTokenBot(groupUUID: string, botUUID: string) {
  await request.post('/bot/msg/token/delete', {
    groupUUID,
    botUUID,
  });
}

/**
 * 获取机器人列表
 * @param groupUUID 团UUID
 */
export async function getMsgTokenBotList(
  groupUUID: string
): Promise<MsgTokenBot[]> {
  const { data } = await request.get(
    `/bot/msg/token/list?groupUUID=${groupUUID}`
  );

  console.log('data', data);

  return data.list ?? [];
}
