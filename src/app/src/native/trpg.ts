import { NativeModules } from 'react-native';

const TRPGModule = NativeModules.TRPGModule;

interface NotifyOptions {
  message: string;
  title?: string;
}

/**
 * 发送基本通知
 * @param options 通知配置
 */
export const sendBasicNotify = (options: NotifyOptions) => {
  TRPGModule.sendBasicNotify(options);
};

/**
 * 清除所有推送
 */
export const clearAllNotifications = () => {
  TRPGModule.clearAllNotifications();
};
