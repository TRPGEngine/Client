import _isNil from 'lodash/isNil';

const requestMockMapping: [string, any][] = [
  [
    '/info/website/info',
    {
      info: {
        title: 'mock title',
        content: 'mock content',
      },
    },
  ],
];

const mockRequest = jest.fn((path: string) => {
  const specMock = requestMockMapping.find((item) => path.startsWith(item[0]));
  if (!_isNil(specMock)) {
    return Promise.resolve({
      data: specMock[1],
    });
  }

  return Promise.resolve({
    data: null,
  });
});

export const request = {
  get: mockRequest,
  post: mockRequest,
};

export default (path: string) => {
  const specMock = requestMockMapping.find((item) => path.startsWith(item[0]));
  if (!_isNil(specMock)) {
    return Promise.resolve({
      data: specMock[1],
    });
  }

  return Promise.resolve({
    data: null,
  });
};
