import moment, { MomentInput } from 'moment';

export const getShortDiff = (str: string): string => {
  let date = str ? moment(str) : moment();
  if (helper.isToday(date)) {
    return date.format('HH:mm');
  } else {
    return date.fromNow();
  }
};
export const getShortDate = (str: string): string => {
  let date = str ? moment(str) : moment();
  if (helper.isToday(date)) {
    return date.format('A hh:mm');
  } else {
    return date.format('MM-DD HH:mm');
  }
};
export const getMsgDate = (str: string): string => {
  let date = str ? moment(str) : moment();
  if (helper.isToday(date)) {
    return date.format('HH:mm:ss');
  } else {
    return date.format('YYYY-MM-DD HH:mm:ss');
  }
};
export const getFullDate = (str?: string): string => {
  let date = str ? moment(str) : moment();
  return date.format('YYYY-MM-DD HH:mm:ss');
};
export const getSamlpeDate = (str: string): string => {
  let date = str ? moment(str) : moment();
  return date.format('YYYY-MM-DD');
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
  return diffTime / 1000 / 60 >= 10; // 超过10分钟
};

const helper = {
  getShortDiff,
  getShortDate,
  getMsgDate,
  getFullDate,
  getSamlpeDate,
  isToday,
  getDateDiff,
};

export default helper;
