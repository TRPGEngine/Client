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
import _isString from 'lodash/isString';
import styled from 'styled-components';
import { getFirstImageUrlFromHTML } from './utils';
import { TMemo } from '@shared/components/TMemo';
import { useIsMobile } from '@web/hooks/useIsMobile';

declare module 'react' {
  interface ImgHTMLAttributes<T> extends HTMLAttributes<T> {
    referrerPolicy?: string;
  }
}

const parser = new Parser<RSSItem>();

const Root = styled.div`
  padding: 16px;
`;

const RssListItem = styled(List.Item)`
  align-items: flex-start !important;
  transition: background-color 0.1s linear;

  &:hover {
    background-color: ${(props) => props.theme.color.transparent90};
  }

  .ant-list-vertical & .ant-list-item-extra {
    width: 100%;
  }
`;

const RssItemImageContainer = styled.div`
  width: 272px;
  height: 168px;
  overflow: hidden;
  position: relative;

  .ant-list-vertical & {
    width: 100%;
  }

  > img {
    position: absolute;
    width: 100%;
  }
`;

interface RSSItem extends Parser.Output<{ [key: string]: any }> {
  title?: string;
}

const RssItemImage: React.FC<{
  content: string;
}> = TMemo(({ content }) => {
  const url = getFirstImageUrlFromHTML(content);

  if (_isString(url)) {
    return (
      <RssItemImageContainer>
        <img referrerPolicy={'no-referrer'} src={url} />
      </RssItemImageContainer>
    );
  } else {
    return null;
  }
});
RssItemImage.displayName = 'RssItemImage';

interface Props extends RouteComponentProps {}
const News: React.FC<Props> = TMemo((props) => {
  const isMobile = useIsMobile();
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
        itemLayout={isMobile ? 'vertical' : 'horizontal'}
        dataSource={value}
        renderItem={(item) => (
          <RssListItem extra={<RssItemImage content={item.content ?? ''} />}>
            <List.Item.Meta
              title={
                <a
                  key={item.guid}
                  href={item.link}
                  target="_blank"
                  rel="noopener"
                >
                  {item.title}
                </a>
              }
              description={item.contentSnippet}
            />
          </RssListItem>
        )}
      />
    </Root>
  );
});
News.displayName = 'News';

export default News;
