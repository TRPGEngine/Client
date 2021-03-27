import React, { useEffect, useState, useCallback } from 'react';
import { View, RichText } from '@tarojs/components';
import { AtCard, AtDivider } from 'taro-ui';
import { fetchAllRecruitList, RecruitItemType } from '@shared/model/trpg';
import Taro from '@tarojs/taro';

import './index.less';

// #region 书写注意
//
// 目前 typescript 版本还无法在装饰器模式下将 Props 注入到 Taro.Component 中的 props 属性
// 需要显示声明 connect 的参数类型并通过 interface 的方式指定 Taro.Component 子类的 props
// 这样才能完成类型检查和 IDE 的自动提示
// 使用函数模式则无此限制
// ref: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20796
//
// #endregion

const Index: React.FC = () => {
  const [recruitList, setRecruitList] = useState<RecruitItemType[]>([]);
  useEffect(() => {
    fetchAllRecruitList()
      .then((list) => {
        console.log(list);
        setRecruitList(list);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleClick = useCallback((recruitUUID: string) => {
    Taro.navigateTo({
      url: `/pages/recruitDetail/index?recruitUUID=${recruitUUID}`,
    });
  }, []);

  return (
    <View className="root">
      {recruitList.map((recruit) => {
        return (
          <View
            key={recruit.uuid}
            style={{
              marginBottom: 10,
            }}
            onClick={() => handleClick(recruit.uuid)}
          >
            <AtCard
              note={recruit.author}
              extra={recruit.platform}
              title={recruit.title}
              thumb="http://www.logoquan.com/upload/list/20180421/logoquan15259400209.PNG"
            >
              <RichText nodes={recruit.content} />
            </AtCard>
          </View>
        );
      })}

      {recruitList.length > 3 && <AtDivider content="没有更多了" />}
    </View>
  );
};

export default Index;
