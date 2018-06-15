exports.web = function() {
  window.onerror = function(message, source, lineno, colno, error) {
    console.log('error report:');
    console.log(message, source, lineno, colno, error);
    console.log('=============');
  }

  console.error = (function(oriLogFunc){
    return function(err) {
      oriLogFunc.call(console, err);

      let stack = '';
      if(err.stack) {
        stack = err.stack;
      }else {
        let data = {};
        Error.captureStackTrace(data);
        stack = data.stack;
      }
      console.log('捕获错误, 等待发送错误报告\n', err, '\n', stack);
    }
  })(console.error);
}
