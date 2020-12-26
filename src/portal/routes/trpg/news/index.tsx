import Loading from '@portal/components/Loading';
import config from '@shared/project.config';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useAsync } from 'react-use';
import Parser from 'rss-parser';
import _orderBy from 'lodash/orderBy';
import { Empty, List } from 'antd';
import _flatten from 'lodash/flatten';
import _isNil from 'lodash/isNil';
import styled from 'styled-components';

const parser = new Parser<RSSItem>();

const Root = styled.div`
  padding: 16px;
`;

interface RSSItem extends Parser.Output<{ [key: string]: any }> {
  title?: string;
}

interface Props extends RouteComponentProps {}
const News: React.FC<Props> = React.memo((props) => {
  const { value, loading } = useAsync(async () => {
    try {
      const list = await Promise.all(
        config.url.rssNews.map(({ url }) =>
          fetch(url)
            .then((res) => res.text())
            .then((xml) => parser.parseString(xml))
            .catch(() => null)
        )
      );

      return _orderBy(
        _flatten(
          list
            .filter((item): item is RSSItem => item !== null)
            .map((item) => item.items)
        ),
        'isoDate',
        'desc'
      );
    } catch (err) {
      console.error(err);
      return null;
    }
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (_isNil(value)) {
    return <Empty />;
  }

  return (
    <Root>
      <h2>TRPG 动态</h2>
      <List
        itemLayout="horizontal"
        dataSource={value}
        renderItem={(item) => (
          <a href={item.link} target="_blank" rel="noopener">
            <List.Item>
              <List.Item.Meta
                title={item.title}
                description={item.contentSnippet}
              />
            </List.Item>
          </a>
        )}
      />
    </Root>
  );
});
News.displayName = 'News';

export default News;
