import moment from 'moment';

export const getShortDiff = (str) => {
  let date = str ? moment(str) : moment();
  if (helper.isToday(date)) {
    return date.format('HH:mm');
  } else {
    return date.fromNow();
  }
};
export const getShortDate = (str) => {
  let date = str ? moment(str) : moment();
  if (helper.isToday(date)) {
    return date.format('A hh:mm');
  } else {
    return date.format('MM-DD HH:mm');
  }
};
export const getMsgDate = (str) => {
  let date = str ? moment(str) : moment();
  if (helper.isToday(date)) {
    return date.format('HH:mm:ss');
  } else {
    return date.format('YYYY-MM-DD HH:mm:ss');
  }
};
export const getFullDate = (str) => {
  let date = str ? moment(str) : moment();
  return date.format('YYYY-MM-DD HH:mm:ss');
};
export const getSamlpeDate = (str) => {
  let date = str ? moment(str) : moment();
  return date.format('YYYY-MM-DD');
};
export const isToday = (date) => {
  return moment().isSame(date, 'day');
};
export const getDateDiff = (prevDate, nextDate) => {
  return new Date(nextDate) - new Date(prevDate);
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
