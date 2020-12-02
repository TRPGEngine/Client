import {
  getBrowserFlag,
  getBrowserName,
  getBrowserVersion,
} from './browser-helper';

/**
 * 构建rtc设备信息
 */
export function buildDeviceInfo() {
  return {
    flag: getBrowserFlag(),
    name: getBrowserName(),
    version: getBrowserVersion(),
  };
}
