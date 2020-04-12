import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ModalPanel from '../ModalPanel';
import config from '@shared/project.config';
import dateHelper from '@shared/utils/date-helper';
import { TMemo } from '@shared/components/TMemo';
import { useTRPGSelector } from '@shared/hooks/useTRPGSelector';

const SystemStatusPanel = styled(ModalPanel)`
  width: 420px;
`;

const InfoTable = styled.table`
  width: 100%;
  text-align: left;
  color: #333;
  line-height: 2em;
`;

const LocalTimer: React.FC = TMemo(() => {
  const [timestamp, setTimestamp] = useState(dateHelper.getFullDate());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimestamp(dateHelper.getFullDate());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []); // 传入空数组表示不依赖任何数据进行更新。即只会运行一次

  return <span>{timestamp}</span>;
});
LocalTimer.displayName = 'LocalTimer';

const CurrentSocketId: React.FC = TMemo(() => {
  const socketId = useTRPGSelector((state) => state.ui.socketId);

  return <span>{socketId}</span>;
});
CurrentSocketId.displayName = 'CurrentSocketId';

export default class SystemStatus extends React.PureComponent {
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
        label: 'Portal服务地址',
        value: config.url.portal,
      },
      {
        label: '编译环境',
        value: config.environment,
      },
      {
        label: '当前版本号',
        value: config.version,
      },
      {
        label: '当前连接',
        value: <CurrentSocketId />,
      },
      {
        label: '本地时间',
        value: <LocalTimer />,
      },
    ];
  }

  render() {
    return (
      <SystemStatusPanel title="系统状态">
        <InfoTable>
          {this.status.map((item) => (
            <tr key={item.label}>
              <td>{item.label}:</td>
              <td>{item.value}</td>
            </tr>
          ))}
        </InfoTable>
      </SystemStatusPanel>
    );
  }
}
