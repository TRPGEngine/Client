import React from 'react';
import { Spin as AntSpin, Icon } from 'antd';

const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

const Spin = React.memo(() => <AntSpin indicator={antIcon} />);

export default Spin;
