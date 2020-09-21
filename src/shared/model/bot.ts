import { request } from '@shared/utils/request';

interface MsgTokenBot {
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
