import './date-init';

declare global {
  interface Date {
    Format(fmt: string): string;
  }

  interface Array<T> {
    remove(val: T): T[];
  }
}

Date.prototype.Format = function(fmt) {
  // author: meizz
  const o = {
    'M+': this.getMonth() + 1, // 月份
    'd+': this.getDate(), // 日
    'h+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    S: this.getMilliseconds(), // 毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + '').substr(4 - RegExp.$1.length)
    );
  for (const k in o)
    if (new RegExp('(' + k + ')').test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      );
  return fmt;
};

Array.prototype.remove = function(val) {
  const arr = Object.assign([], this);
  const index = arr.indexOf(val);
  if (index > -1) {
    arr.splice(index, 1);
  }

  return arr;
};

console.log('common utils loaded!');
