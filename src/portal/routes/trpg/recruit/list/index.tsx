import React, { useState, useCallback, useEffect } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { RecruitItem } from '../RecruitItem';
import MasonryLayout from 'react-masonry-layout';
import { RecruitItemType, fetchAllRecruitList } from '@shared/model/trpg';
import { Layout, Empty, Button } from 'antd';
import Loading from '@portal/components/Loading';
import { RecruitCreateBtn } from './CreateBtn';
import { MyBtn } from './MyBtn';
import config from '@shared/project.config';
import { QuestionCircleOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;

const RecruitList: React.FC = TMemo(() => {
  const [items, setItems] = useState<RecruitItemType[]>([]);
  const [infiniteScrollLoading, setInfiniteScrollLoading] = useState<boolean>(
    false
  );

  const fetch = useCallback(async () => {
    // 获取招募列表
    setInfiniteScrollLoading(true);
    const list = await fetchAllRecruitList();
    setItems(list);
    setInfiniteScrollLoading(false);
  }, [setInfiniteScrollLoading, setItems]);

  useEffect(() => {
    fetch();
  }, []);

  return (
    <Layout>
      <Header style={{ textAlign: 'right' }}>
        <Button
          type="link"
          onClick={() => window.open(`${config.url.homepage}docs/recruit`)}
        >
          <QuestionCircleOutlined />
        </Button>
        <MyBtn onUpdate={fetch} />
        <RecruitCreateBtn onSuccess={fetch} />
      </Header>
      <Content style={{ padding: '12px 0' }}>
        {Array.isArray(items) && items.length > 0 ? (
          <MasonryLayout
            id="masonry-layout"
            style={{ margin: 'auto' }}
            infiniteScrollDisabled={false}
          >
            {items.map((item, i) => {
              return <RecruitItem key={i} data={item} />;
            })}
          </MasonryLayout>
        ) : infiniteScrollLoading === false ? (
          <Empty />
        ) : null}

        {infiniteScrollLoading && <Loading style={{ padding: 10 }} />}
      </Content>
    </Layout>
  );
});
RecruitList.displayName = 'RecruitList';

export default RecruitList;
