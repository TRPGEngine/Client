import React, { useState, useCallback, useEffect } from 'react';
import { TMemo } from '@shared/components/TMemo';
import MasonryLayout from 'react-masonry-layout'; // https://www.npmjs.com/package/react-masonry-layout

// 或者使用https://github.com/xudafeng/autoresponsive-react?
// 需要考虑一下哪个库比较大再决定

const RecruitList: React.FC = TMemo(() => {
  const [items, setItems] = useState<string[]>([]);
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
      setItems(items.concat(Array(20).fill('a')));
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

          return (
            <div
              key={i}
              style={{
                width: '180px',
                height: `${height}px`,
                lineHeight: `${height}px`,
                color: 'white',
                fontSize: '32px',
                display: 'block',
                background: 'rgba(0,0,0,0.7)',
              }}
            >
              {i}
            </div>
          );
        })}
      </MasonryLayout>
    </div>
  );
});
RecruitList.displayName = 'RecruitList';

export default RecruitList;
