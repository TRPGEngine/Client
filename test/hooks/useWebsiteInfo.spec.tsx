import React from 'react';
import { mount } from 'enzyme';
import { useWebsiteInfo } from '@shared/hooks/useWebsiteInfo';
import { sleep } from '@test/utils';

const TestComponent: React.FC<{ message: string }> = (props) => {
  const { loading, hasUrl, info } = useWebsiteInfo(props.message);
  return (
    <div>
      <p className="loading">{String(loading)}</p>
      <p className="hasUrl">{String(hasUrl)}</p>
      <p className="info">{JSON.stringify(info)}</p>
    </div>
  );
};

describe('useWebsiteInfo', () => {
  test('useWebsiteInfo should be ok', async () => {
    const wrapper = mount(
      <TestComponent message={'[url]https://www.baidu.com[/url]'} />
    );

    expect(wrapper.find('.loading').text()).toBe('true');
    expect(wrapper.find('.hasUrl').text()).toBe('true');
    expect(wrapper.find('.info').text()).toBe('null');

    await sleep(0);
    wrapper.update();

    expect(wrapper.find('.loading').text()).toBe('false');
    expect(wrapper.find('.hasUrl').text()).toBe('true');
    expect(wrapper.find('.info').text()).toBe(
      '{"title":"mock title","content":"mock content"}'
    );
  });
});
