import './date-init';

declare global {
  interface Array<T> {
    remove(val: T): T[];
  }
}

Array.prototype.remove = function(val) {
  const arr = Object.assign([], this);
  const index = arr.indexOf(val);
  if (index > -1) {
    arr.splice(index, 1);
  }

  return arr;
};

console.log('common utils loaded!');
