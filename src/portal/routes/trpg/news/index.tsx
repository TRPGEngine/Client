import Loading from '@portal/components/Loading';
import config from '@shared/project.config';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useAsync } from 'react-use';
import Parser from 'rss-parser';
import _orderBy from 'lodash/orderBy';
import { transformToDom } from './utils';
const parser = new Parser<RSSItem>();

interface RSSItem {
  title?: string;
}

interface Props extends RouteComponentProps {}
const News: React.FC<Props> = React.memo((props) => {
  const { value, loading } = useAsync(async () => {
    const list = await Promise.all(
      config.url.rssNews.map(({ url }) =>
        fetch(url)
          .then((res) => res.text())
          .then((xml) => parser.parseString(xml))
          .catch(() => null)
      )
    );

    return list.filter((item) => item !== null);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <h2>TRPG 动态</h2>
      <div>
        {value?.map((scope) =>
          scope?.items.map((item, i) => {
            return (
              <div key={i}>
                <p>{item.title}</p>
                <p>{transformToDom(item.content ?? '')}</p>
                <hr />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
});
News.displayName = 'News';

export default News;
