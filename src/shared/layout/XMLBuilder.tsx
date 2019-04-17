import React, { useEffect, useState, useReducer } from 'react';
import parser, { XMLElement } from './parser/xml-parser';
import processor from './processor';
import _clone from 'lodash/clone';
import _isEmpty from 'lodash/isEmpty';
import _isUndefined from 'lodash/isUndefined';
import './types/__all__';

interface DefineType {
  [name: string]: React.ComponentType;
}

interface GlobalType {
  [name: string]: number | string | null;
}

interface DataType {
  [name: string]: number | string | null;
}

export interface XMLBuilderContext {
  defines: DefineType;
  global: GlobalType;
  data: DataType;
}

const XMLBuilderReducer = (prevState: any, action: any): any => {
  const type = action.type;
  const payload = action.payload;
  const newState = _clone(prevState);

  switch (type) {
    case 'update_data':
      newState.data = payload;
      break;
  }

  return newState;
};

const XMLBuilder = (props) => {
  const { xml = '' } = props;
  const [layout, setLayout] = useState({});

  const contextValue: XMLBuilderContext = {
    defines: {},
    global: {},
    data: {},
  };
  const [state, dispatch] = useReducer(XMLBuilderReducer, contextValue);
  // const context = React.createContext(contextValue);

  useEffect(
    () => {
      const layout = parser(xml);
      layout.type = 'root';
      console.log('layout', layout);
      setLayout(layout);
    },
    [xml]
  );

  if (_isEmpty(layout)) {
    return null;
  }

  // const Provider = context.Provider;
  return (
    <div>
      xmlbuilder:
      {/* <Provider value={contextValue}> */}
      {processor.render(layout, { state, dispatch })}
      {/* </Provider> */}
    </div>
  );
};

export default XMLBuilder;
