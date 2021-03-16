import memoizeOne from 'memoize-one';
import * as trpgApi from '../trpg.api';
const api = trpgApi.getInstance();

/**
 * 设定会话已读
 * @param converseUUID 会话UUID, 可以为团UUID, 频道UUID 和 用户UUID
 * @param lastLogUUID 最后一条消息的UUID
 */
async function setConverseAck(converseUUID: string, lastLogUUID: string) {
  try {
    await api.emitP('chat::setConverseAck', {
      converseUUID,
      lastLogUUID,
    });
  } catch (err) {
    console.error('发送ack信息失败:', err);
  }
}

export const setConverseAckWithMsgTime = memoizeOne(
  async (
    converseUUID: string,
    lastLogUUID: string,
    lastLogTimestamp: number
  ) => {
    await setConverseAck(converseUUID, lastLogUUID);
  },
  (newArgs, lastArgs) => {
    if (newArgs[0] !== lastArgs[0]) {
      // 如果第一个参数(会话UUID)不同, 则直接跳过
      return false;
    }

    // 如果第三个参数(最后消息的时间) 小于等于 之前的时间
    // 则视为该消息过旧，不发送ack消息
    // 即发送消息的ack消息的时间永远更大
    return newArgs[2] <= lastArgs[2];
  }
);
