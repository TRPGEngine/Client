import _noop from 'lodash/noop';

// 用于处理原生模块的mock
jest.mock('../src/web/components/Image', () => 'mock-image');
