import React, { useEffect, useState } from 'react';
import parser from './parser';
import processor from './processor';
import _isEmpty from 'lodash/isEmpty';

const XMLBuilder = (props) => {
  const { xml = '' } = props;
  const [layout, setLayout] = useState({});

  useEffect(
    () => {
      const data = parser(xml);
      data.type = 'root';
      console.log('data', data);
      setLayout(data);
    },
    [xml]
  );

  if (_isEmpty(layout)) {
    return null;
  }

  return <div>xmlbuilder:{processor.render(layout)}</div>;
};

export default XMLBuilder;
