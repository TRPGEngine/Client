import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import dateHelper from '../../shared/utils/date-helper';
import config from '../../shared/project.config';

import styled from 'styled-components/native';
import request from '../../shared/utils/request';

const LocalTimer = () => {
  const [timestamp, setTimestamp] = useState(dateHelper.getFullDate());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimestamp(dateHelper.getFullDate());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []); // 传入空数组表示不依赖任何数据进行更新。即只会运行一次

  return <Text>{timestamp}</Text>;
};

const HTTPStatus = () => {
  const [requesting, setRequesting] = useState(false);
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    (async () => {
      setRequesting(true);
      const res = await request('/core/health', 'get', {});

      setRequesting(false);
      if (res.status === 200) {
        setAvailable(true);
      } else {
        setAvailable(false);
      }
    })();
  }, []);

  return (
    <Text>{requesting ? '请求中...' : available ? '可用' : '不可用'}</Text>
  );
};

const Container = styled.View`
  padding: 10px;
`;

const InfoView = styled.View`
  width: 100%;
  text-align: left;
  color: #333;
`;

export default class SystemStatus extends React.Component {
  get status() {
    return [
      {
        label: '后台服务地址',
        value: `${config.io.protocol}://${config.io.host}:${config.io.port}`,
      },
      {
        label: '网页服务地址',
        value: config.file.url,
      },
      {
        label: '编译环境',
        value: config.environment,
      },
      {
        label: '本地时间',
        value: <LocalTimer />,
      },
      {
        label: 'HTTP服务',
        value: <HTTPStatus />,
      },
    ];
  }

  render() {
    return (
      <Container>
        <InfoView>
          {this.status.map((item) => (
            <View key={item.label}>
              <Text>{item.label}</Text>
              <Text>- {item.value}</Text>
            </View>
          ))}
        </InfoView>
      </Container>
    );
  }
}
