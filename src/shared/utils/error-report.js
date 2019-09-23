import axios from 'axios';
import config from '../project.config';

export function sendErrorReport(data) {
  axios
    .post(config.file.getAbsolutePath('/report/error'), data)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.error(err);
    });
}

// 弃用, 改为组件发起
export const web = function() {
  // window.onerror = function(message, source, lineno, colno, error) {
  //   console.log('error report:');
  //   console.log(message, source, lineno, colno, error);
  //   console.log('=============');
  // }

  console.error = (function(oriLogFunc) {
    return function(err) {
      oriLogFunc.call(console, err);

      let stack = '';
      if (err.stack) {
        stack = err.stack;
      } else {
        let data = {};
        Error.captureStackTrace(data);
        stack = data.stack;
      }
      console.log('捕获错误, 等待发送错误报告\n', err, '\n', stack);
      sendErrorReport({
        message: err.toString(),
        stack,
      });
    };
  })(console.error);
};
