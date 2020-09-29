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
