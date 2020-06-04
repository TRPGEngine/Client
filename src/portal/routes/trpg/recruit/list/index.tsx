import React, { useState, useCallback, useEffect } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { RecruitItem } from './Item';
import MasonryLayout from 'react-masonry-layout'; // https://www.npmjs.com/package/react-masonry-layout
import { RecruitItemType } from '@portal/model/trpg';
import testRecuitList from './__tests__/data';
import { Layout, Select, Button, Row } from 'antd';
import Loading from '@portal/components/Loading';

const { Header, Content } = Layout;

const RecruitList: React.FC = TMemo(() => {
  const [items, setItems] = useState<RecruitItemType[]>([]);
  const [infiniteScrollLoading, setInfiniteScrollLoading] = useState<boolean>(
    false
  );

  useEffect(() => {
    setTimeout(() => {
      loadItems();
    }, 2000);
  }, []);

  const loadItems = useCallback(() => {
    setInfiniteScrollLoading(true);
    setTimeout(() => {
      setItems(items.concat(testRecuitList));
      setInfiniteScrollLoading(false);
    }, 5000);
  }, [items, setItems, setInfiniteScrollLoading]);

  const handleCreateRecruit = useCallback(() => {
    // TODO
    // 打开modal
    alert('open modal');
  }, []);

  return (
    <Layout>
      <Header style={{ textAlign: 'right' }}>
        <Button type="primary" ghost={true} onClick={handleCreateRecruit}>
          发布招募
        </Button>
      </Header>
      <Content>
        <MasonryLayout
          id="masonry-layout"
          style={{ margin: 'auto' }}
          infiniteScrollDisabled={true}
          infiniteScrollSpinner={<Loading style={{ padding: 10 }} />}
          infiniteScroll={loadItems}
          infiniteScrollLoading={infiniteScrollLoading}
        >
          {items.map((item, i) => {
            return <RecruitItem key={i} data={item} />;
          })}
        </MasonryLayout>
      </Content>
    </Layout>
  );
});
RecruitList.displayName = 'RecruitList';

export default RecruitList;
