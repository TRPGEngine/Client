import { View } from '@tarojs/components';
import React, { useCallback, useState } from 'react';
import { AtButton, AtForm, AtInput } from 'taro-ui';
import { loginWithPassword } from '@shared/model/player';
import { showToasts } from '@shared/manager/ui';
import Taro from '@tarojs/taro';
import { useDispatch } from 'react-redux';
import { getStorage } from '@shared/manager/storage';
import { TARO_JWT_KEY } from '@shared/utils/consts';
import { setUserInfo } from '../../slices/user';

import './index.less';

const Page: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleLogin = useCallback(() => {
    loginWithPassword(username, password)
      .then(
        ({ jwt, info }) => {
          showToasts('登录成功');
          console.log(jwt, info);
          dispatch(
            setUserInfo({
              jwt,
              info,
            })
          );
          getStorage().save(TARO_JWT_KEY, jwt);
          Taro.navigateBack();
        },
        () => {
          showToasts('登录失败, 请检查用户名密码');
        }
      )
      .catch((err) => {
        showToasts('操作失败, 请联系管理员');
        console.error(err);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, password]);

  return (
    <View className="root">
      <AtForm>
        <AtInput
          name="username"
          type="text"
          title="用户名"
          placeholder="请输入您的用户名"
          value={username}
          onChange={(v) => setUsername(String(v))}
        />
        <AtInput
          name="password"
          type="password"
          title="密码"
          placeholder="请输入您的密码"
          value={password}
          onChange={(v) => setPassword(String(v))}
        />

        <AtButton className="login-btn" type="primary" onClick={handleLogin}>
          登录
        </AtButton>
      </AtForm>
    </View>
  );
};

export default Page;
