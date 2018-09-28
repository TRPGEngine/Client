const moment = require('moment');

let helper = {
  getShortDiff: (str) => {
    let date = str ? moment(str) : moment();
    if(helper.isToday(date)) {
      return date.format('HH:mm');
    }else {
      return date.fromNow();
    }
  },
  getShortDate: (str) => {
    let date = str ? moment(str) : moment();
    if(helper.isToday(date)) {
      return date.format('HH:mm');
    }else {
      return date.format('MM-DD HH:mm');
    }
  },
  getMsgDate: (str) => {
    let date = str ? moment(str) : moment();
    if(helper.isToday(date)) {
      return date.format('HH:mm:ss');
    }else {
      return date.format('YYYY-MM-DD HH:mm:ss');
    }
  },
  getFullDate: (str) => {
    let date = str ? moment(str) : moment();
    return date.format('YYYY-MM-DD HH:mm:ss');
  },
  getSamlpeDate: (str) => {
    let date = str ? moment(str) : moment();
    return date.format('YYYY-MM-DD');
  },
  isToday: (date) => {
    return moment().isSame(date, 'day');
  },
  getDateDiff: (prevDate, nextDate) => {
    return new Date(nextDate) - new Date(prevDate);
  }
}

module.exports = helper;
