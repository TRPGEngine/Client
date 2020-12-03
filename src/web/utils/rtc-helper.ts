import { browser } from './browser-helper';

/**
 * 构建rtc设备信息
 */
export function buildDeviceInfo() {
  return {
    flag: browser.getBrowserFlag(),
    name: browser.getBrowserName(),
    version: browser.getBrowserVersion(),
  };
}
