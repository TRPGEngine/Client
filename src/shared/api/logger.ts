import _isNil from 'lodash/isNil';

interface LoggerHandle {
  debug: (...args: any[]) => void;
  info: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
}

// 默认的日志处理器
let _loggerHandler: LoggerHandle = {
  debug: console.debug,
  info: console.log,
  warn: console.warn,
  error: console.error,
};
export function setLoggerConfig(handler: LoggerHandle) {
  _loggerHandler = handler;
}

class Logger {
  debug(...args: any[]) {
    _loggerHandler.debug(...args);
  }
  info(...args: any[]) {
    _loggerHandler.info(...args);
  }
  warn(...args: any[]) {
    _loggerHandler.warn(...args);
  }
  error(...args: any[]) {
    _loggerHandler.error(...args);
  }
}

export const logger: Logger = new Logger();
