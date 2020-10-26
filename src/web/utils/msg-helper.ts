import config from '@shared/project.config';

/**
 * 获取消息默认的头像
 * 网页版
 */
export function getWebMsgDefaultAvatar(uuid: string, name: string): string {
  if (uuid === 'trpgsystem') {
    return config.defaultImg.trpgsystem;
  } else if (uuid === 'trpgbot') {
    return config.defaultImg.robot;
  } else {
    return config.defaultImg.getUser(name);
  }
}
