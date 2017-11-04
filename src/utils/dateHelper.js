const moment = require('moment');

let helper = {
  getShortDate: (str) => {
    let date = str ? moment(str) : moment();
    if(helper.isToday(date)) {
      return date.format('HH:mm');
    }else {
      return date.fromNow();
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
  getFullDate: () => {
    let date = str ? moment(str) : moment();
    return date.format('YYYY-MM-DD HH:mm:ss');
  },
  isToday: (date) => {
    return moment().isSame(date, 'day');
  },
}

module.exports = helper;
