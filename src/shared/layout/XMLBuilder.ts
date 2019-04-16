import React, { useEffect, useState, useContext } from 'react';
import parser from './parser';
import processor from './processor';
import _isEmpty from 'lodash/isEmpty';
import _isUndefined from 'lodash/isUndefined';
import './types/__all__';

const XMLBuilder = (props) => {
  const { xml = '' } = props;
  const [layout, setLayout] = useState({});
  const context = React.createContext(null);

  useEffect(
    () => {
      const data = parser(xml);
      data.type = 'root';
      console.log('data', data);
      setLayout(data);
    },
    [xml]
  );

  if (_isEmpty(layout) || _isUndefined(context)) {
    return null;
  }

  const Provider = context.Provider;
  return (
    <div>
      xmlbuilder:
      <Provider>{processor.render(layout, context)}</Provider>
    </div>
  );
};

export default XMLBuilder;
