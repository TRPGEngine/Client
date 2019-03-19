import React from 'react';
import styled from 'styled-components';
const ModalPanel = require('../ModalPanel');
const config = require('../../../../config/project.config');

const SystemStatusPanel = styled(ModalPanel)`
  width: 420px;
`;

const InfoTable = styled.table`
  width: 100%;
  text-align: left;
  color: #333;
  line-height: 2em;
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
    ];
  }

  render() {
    return (
      <SystemStatusPanel title="系统状态">
        <InfoTable>
          {this.status.map((item) => (
            <tr>
              <td>{item.label}:</td>
              <td>{item.value}</td>
            </tr>
          ))}
        </InfoTable>
      </SystemStatusPanel>
    );
  }
}
