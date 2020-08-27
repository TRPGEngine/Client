/**
 * 该文件是在一个统一的地方集中管理消息相关处理的内容
 */
import _pick from 'lodash/pick';
import _isNil from 'lodash/isNil';
import _isPlainObject from 'lodash/isPlainObject';
import _has from 'lodash/has';
import { GroupActorType } from '@redux/types/group';
import { MsgPayload } from '@redux/types/chat';

const replyMsgFields = ['uuid', 'message', 'sender_uuid'] as const;
export type ReplyMsgType = Pick<MsgPayload, typeof replyMsgFields[number]>;

/**
 * 消息数据管理类
 */
export class MsgDataManager {
  name?: string; // 如果该字段有值，则会替换消息的发送者名称
  avatar?: string; // 如果该字段有值，则会替换消息的发送者头像
  groupActorUUID?: string;
  replyMsg?: ReplyMsgType;

  /**
   * 设置相关的用户角色
   * 用于选中人物卡后所有的消息都会关联上该角色
   */
  setGroupActorInfo(groupActorInfo: GroupActorType) {
    if (_isNil(groupActorInfo)) {
      return;
    }

    this.name = groupActorInfo.name;
    this.avatar = groupActorInfo.avatar;
    this.groupActorUUID = groupActorInfo.uuid;
  }

  /**
   * 设置回复消息内容
   */
  setReplyMsg(replyMsg: ReplyMsgType) {
    if (_isNil(replyMsg)) {
      return;
    }

    this.replyMsg = _pick(replyMsg, replyMsgFields);
  }

  hasReplyMsg(): boolean {
    return _has(this, 'replyMsg');
  }

  getReplyMsg(): ReplyMsgType | undefined {
    return this.replyMsg;
  }

  parseData(data: any) {
    if (_isNil(data) || !_isPlainObject(data)) {
      return;
    }

    Object.assign(this, data);
  }

  toJS() {
    const names = Object.getOwnPropertyNames(this);
    if (names.length === 0) {
      return undefined;
    }
    return _pick(this, names);
  }
}
