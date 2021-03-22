import React, { useEffect, useState, useCallback } from 'react';
import { TMemo } from '@shared/components/TMemo';
import {
  fetchUserRecruitList,
  RecruitItemType,
  setRecruitCompleted,
} from '@shared/model/trpg';
import _orderBy from 'lodash/orderBy';
import _isFunction from 'lodash/isFunction';
import { List, Button, message, Tooltip } from 'antd';
import { handleError } from '@web/utils/error';
import HTML from '@web/components/HTML';
import Loading from '@portal/components/Loading';

export const MyRecruitList: React.FC<{
  onUpdate?: () => void;
}> = TMemo((props) => {
  const { onUpdate } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [list, setList] = useState<RecruitItemType[]>([]);

  useEffect(() => {
    setIsLoading(true);
    fetchUserRecruitList().then((list) => {
      setList(_orderBy(list, ['completed', 'updatedAt'], ['asc', 'desc']));
      setIsLoading(false);
    });
  }, []);

  const handleCompleteRecruit = useCallback(
    (recruitUUID: string) => {
      setRecruitCompleted(recruitUUID)
        .then(() => {
          setList(
            list.map((item) => {
              if (item.uuid === recruitUUID) {
                return {
                  ...item,
                  completed: true,
                };
              } else {
                return item;
              }
            })
          );
          message.success('操作成功');
          _isFunction(onUpdate) && onUpdate();
        })
        .catch(handleError);
    },
    [list, setList, onUpdate]
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <List
      dataSource={list}
      renderItem={(item) => (
        <List.Item
          actions={[
            item.completed ? null : (
              <Button
                type="link"
                onClick={() => handleCompleteRecruit(item.uuid)}
              >
                完成招募
              </Button>
            ),
          ]}
        >
          <List.Item.Meta
            title={item.title}
            description={
              <Tooltip title={<HTML html={item.content} />}>
                <span>查看内容</span>
              </Tooltip>
            }
          />
        </List.Item>
      )}
    />
  );
});
MyRecruitList.displayName = 'MyRecruitList';
