import type { UserInfo } from '@redux/types/user';
import { buildRegFn } from './buildRegFn';

interface AnalyticObject {
  setAnalyticsUser: (info: UserInfo) => void;
  trackEvent: (name: string, properties?: any) => void;
}

/**
 * 持久化存储相关逻辑
 */
export const [getAnalytics, setAnalytics] = buildRegFn<() => AnalyticObject>(
  'trpgAnalytic',
  () => ({
    // 默认返回空方法
    setAnalyticsUser() {},
    trackEvent() {},
  })
);
