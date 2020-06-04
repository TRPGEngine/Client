import React, { useState, useCallback, useEffect } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { RecruitItem } from './Item';
import MasonryLayout from 'react-masonry-layout'; // https://www.npmjs.com/package/react-masonry-layout
import { RecruitItemType } from '@portal/model/trpg';
import testRecuitList from './__tests__/data';

// 或者使用 https://codesandbox.io/embed/26mjowzpr ?

const RecruitList: React.FC = TMemo(() => {
  const [items, setItems] = useState<RecruitItemType[]>([]);
  const [infiniteScrollLoading, setInfiniteScrollLoading] = useState<boolean>(
    false
  );

  useEffect(() => {
    setTimeout(() => {
      loadItems();
    }, 1000);
  }, []);

  const loadItems = useCallback(() => {
    setInfiniteScrollLoading(true);
    setTimeout(() => {
      setItems(items.concat(testRecuitList));
      setInfiniteScrollLoading(false);
    }, 1000);
  }, [items, setItems, setInfiniteScrollLoading]);

  return (
    <div>
      <MasonryLayout
        id="masonry-layout"
        style={{ margin: 'auto' }}
        infiniteScroll={loadItems}
        infiniteScrollLoading={infiniteScrollLoading}
      >
        {items.map((item, i) => {
          const height = i % 2 === 0 ? 200 : 100;

          return <RecruitItem key={i} data={item} />;
        })}
      </MasonryLayout>
    </div>
  );
});
RecruitList.displayName = 'RecruitList';

export default RecruitList;
