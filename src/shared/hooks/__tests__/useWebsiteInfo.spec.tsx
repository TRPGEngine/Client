import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { useWebsiteInfo } from '@shared/hooks/useWebsiteInfo';

describe('useWebsiteInfo should be ok', () => {
  test.each([
    ['[url]https://www.baidu.com[/url]'],
    ['https://www.baidu.com'],
    ['some text https://www.baidu.com'],
    ['https://www.baidu.com some text'],
  ])('message: %s', async (msg) => {
    const res = renderHook((props) => useWebsiteInfo(msg), {
      initialProps: { msg },
    });

    expect(res.result.current).toMatchObject({
      loading: true,
      hasUrl: true,
      info: { title: '', content: '', url: '' },
    });

    await res.waitForNextUpdate();

    expect(res.result.current).toMatchObject({
      loading: false,
      hasUrl: true,
      info: {
        title: 'mock title',
        content: 'mock content',
        url: 'https://www.baidu.com',
      },
    });
  });
});
