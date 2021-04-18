import { Text, View } from '@tarojs/components';
import React, { useCallback } from 'react';
import Taro from '@tarojs/taro';
import { AtAvatar, AtGrid } from 'taro-ui';
import { getUserName } from '@shared/utils/data-helper';
import { useTaroUserInfo } from '../../hooks/useTaroUserInfo';
import { PageView } from '../../components/PageView';

import './index.less';

const Page: React.FC = () => {
  const userInfo = useTaroUserInfo();

  const handleLogin = useCallback(() => {
    Taro.navigateTo({
      url: `/pages/login/index`,
    });
  }, []);

  return (
    <PageView className="root">
      {userInfo === null ? (
        <View className="profile-header" onClick={handleLogin}>
          <AtAvatar circle text="我"></AtAvatar>
          <Text>点击以登录账号</Text>
        </View>
      ) : (
        <View className="profile-header">
          <AtAvatar
            circle
            text={getUserName(userInfo)}
            image={userInfo.avatar}
          ></AtAvatar>
          <Text>
            {getUserName(userInfo)}({userInfo.username})
          </Text>
        </View>
      )}

      <AtGrid
        data={[
          // {
          //   image:
          //     'https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png',
          //   value: '我的招募',
          // },
          {
            image:
              'https://img20.360buyimg.com/jdphoto/s72x72_jfs/t15151/308/1012305375/2300/536ee6ef/5a411466N040a074b.png',
            value: '发布招募',
            onClick() {
              Taro.navigateTo({
                url: `/pages/recruitCreate/index`,
              });
            },
          },
          // {
          //   image:
          //     'https://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png',
          //   value: '我的关注',
          // },
        ]}
        onClick={(item) => {
          if (typeof item.onClick === 'function') {
            item.onClick();
          }
        }}
      />
    </PageView>
  );
};

export default Page;
