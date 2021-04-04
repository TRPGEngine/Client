import { Text, View } from '@tarojs/components';
import React, { useEffect, useCallback } from 'react';
import Taro from '@tarojs/taro';
import { AtAvatar, AtGrid } from 'taro-ui';

import './index.less';

const Page: React.FC = () => {
  const handleLogin = useCallback(() => {
    Taro.navigateTo({
      url: `/pages/login/index`,
    });
  }, []);

  return (
    <View className="root">
      <View className="profile-header" onClick={handleLogin}>
        <AtAvatar circle text="凹凸实验室"></AtAvatar>
        <Text>点击以登录账号</Text>
      </View>

      <AtGrid
        data={[
          {
            image:
              'https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png',
            value: '我的招募',
          },
          {
            image:
              'https://img20.360buyimg.com/jdphoto/s72x72_jfs/t15151/308/1012305375/2300/536ee6ef/5a411466N040a074b.png',
            value: '发布招募',
          },
          // {
          //   image:
          //     'https://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png',
          //   value: '我的关注',
          // },
        ]}
      />
    </View>
  );
};

export default Page;
