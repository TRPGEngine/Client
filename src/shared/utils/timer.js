const _timerMapping = {};

// 根据key，如果该方法在该任务触发前再次被调用，则取消之前的任务生成一个新的任务，即续期效果
export function renewableDelayTimer(key, fn, millisecond) {
  if (_timerMapping[key]) {
    // 如果之前已经有该任务了, 则取消
    clearTimeout(_timerMapping[key]);
  }
  _timerMapping[key] = setTimeout(function() {
    fn();
    clearTimeout(_timerMapping[key]);
  }, millisecond);
}
