import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin as AntSpin } from 'antd';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin={true} />;

const Spin = React.memo(() => <AntSpin indicator={antIcon} />);

export default Spin;
