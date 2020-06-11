import moment, { MomentInput } from 'moment';
import './date-init';

/**
 * 日期相关帮助函数
 */

/**
 * 获取时间距离现在的可读化结果
 * @param str 时间
 */
export function getFromNow(str?: MomentInput): string {
  const date = str ? moment(str) : moment();
  return date.fromNow();
}
export const getShortDiff = (str: MomentInput): string => {
  const date = str ? moment(str) : moment();
  if (helper.isToday(date)) {
    return date.format('HH:mm');
  } else {
    return date.fromNow();
  }
};
export const getShortDate = (str: string): string => {
  const date = str ? moment(str) : moment();
  if (helper.isToday(date)) {
    return date.format('A hh:mm');
  } else {
    return date.format('MM-DD HH:mm');
  }
};
export const getMsgDate = (str: string): string => {
  const date = str ? moment(str) : moment();
  if (helper.isToday(date)) {
    return date.format('HH:mm:ss');
  } else {
    return date.format('YYYY-MM-DD HH:mm:ss');
  }
};
export const getFullDate = (str?: string): string => {
  const date = str ? moment(str) : moment();
  return date.format('YYYY-MM-DD HH:mm:ss');
};
export const getSimpleDate = (str: string): string => {
  return str ? moment(str).format('YYYY-MM-DD') : '';
};
export const isToday = (date: MomentInput): boolean => {
  return moment().isSame(date, 'day');
};
export const getDateDiff = (
  prevDate: MomentInput,
  nextDate: MomentInput
): number => {
  return moment(nextDate).valueOf() - moment(prevDate).valueOf();
};

/**
 * 判断是否需要强调时间(两个日期间隔超过设定值)
 */
export const shouleEmphasizeTime = (
  prevDate: MomentInput,
  nextDate: MomentInput
): boolean => {
  const diffTime = getDateDiff(prevDate, nextDate);
  return diffTime / 1000 / 60 >= 5; // 超过5分钟
};

const helper = {
  getShortDiff,
  getShortDate,
  getMsgDate,
  getFullDate,
  getSimpleDate,
  isToday,
  getDateDiff,
};

export default helper;
