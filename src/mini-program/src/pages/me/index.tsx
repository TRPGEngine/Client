import { Button, View } from '@tarojs/components';
import React, { useEffect } from 'react';
import Taro from '@tarojs/taro';
// import { AtButton } from 'taro-ui';

import './index.less';

const Page: React.FC = () => {
  useEffect(() => {
    Taro.authorize({
      scope: 'scope.userInfo',
      success: () => {
        Taro.getUserInfo({
          success: (result) => {
            console.log(result);
          },
          fail: () => {
            console.log('获取用户信息失败');
          },
        });
      },
    });
  }, []);

  return (
    <View className="root">
      Profile
      {/* <AtButton openType="getUserInfo">授权访问用户数据</AtButton> */}
      <Button open-type="getUserInfo">授权访问用户数据</Button>
    </View>
  );
};

export default Page;
