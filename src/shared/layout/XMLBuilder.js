import React, { useEffect, useState } from 'react';
import parser from './parser';
import processor from './processor';

const XMLBuilder = (props) => {
  const { xml = '' } = props;
  const { layout, setLayout } = useState({});

  useEffect(() => {
    const data = parser(xml);
    setLayout(data);
  }, [xml]);

  return <div>xmlbuilder:{processor.render(layout)}</div>;
};

export default XMLBuilder;
