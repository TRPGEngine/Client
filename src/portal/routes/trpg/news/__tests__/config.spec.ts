import config from '@shared/project.config';

test('newsRSSUrl', () => {
  expect(config.url.rssNews).toMatchSnapshot();
});
