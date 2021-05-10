import rnStorage from '@shared/api/rn-storage.api';
import { setStorage } from '@shared/manager/storage';
import '@testing-library/jest-dom';
import _noop from 'lodash/noop';

// 用于处理mock
jest.mock('antd/lib/input', () => {
  const ret: any = 'mock-antd-input';
  ret.__proto__.Group = 'mock-antd-input-group';
  ret.__proto__.Search = 'mock-antd-input-search';
  ret.__proto__.TextArea = 'mock-antd-input-textarea';
  ret.__proto__.Password = 'mock-antd-input-password';

  return ret;
});
jest.mock('@web/components/Image', () => 'mock-image');
jest.mock('@shared/i18n');
jest.mock('@shared/utils/request');
jest.mock('@shared/api/socket-api');

// window 相关
window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener() {},
      removeListener() {},
    };
  };

/**
 * mock console
 * 忽略部分错误提示。
 * https://github.com/airbnb/enzyme/issues/2073
 */
const mockConsoleMethod = (realConsoleMethod) => {
  const ignoredMessages = [
    'test was not wrapped in act(...)', // 该问题在升级react 16.9似乎能解决，先忽略
    'The width(0) and height(0) of chart should be greater than 0',
    `You may see this warning because you've called styled inside another component.`, // styled动态生成
  ];

  return (message, ...args) => {
    // 如果环境变量指定安静则不输出打印日志
    if (is(process.env.SILENT)) {
      return;
    }

    let containsIgnoredMessage = false;
    if (typeof message === 'string') {
      containsIgnoredMessage = ignoredMessages.some((ignoredMessage) =>
        message.includes(ignoredMessage)
      );
    }

    if (!containsIgnoredMessage) {
      realConsoleMethod(message, ...args);
    }
  };
};

console.warn = jest.fn(mockConsoleMethod(console.warn));
console.error = jest.fn(mockConsoleMethod(console.error));

/**
 * 用于判定环境变量的值
 */
function is(it?: string) {
  return !!it && it !== '0' && it !== 'false';
}

setStorage(() => rnStorage);
