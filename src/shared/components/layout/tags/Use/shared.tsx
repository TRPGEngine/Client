import React, { useContext } from 'react';
import { TagComponent } from '../type';
import { LayoutStateContext } from '../../context/LayoutStateContext';
import { removePrivateProps } from '../utils';

interface TagProps {
  name: string; // 用于存储数据
  define: string;
}
export const TagUseShared: TagComponent<TagProps> = React.memo((props) => {
  const context = useContext(LayoutStateContext);
  const defines = context.state.defines;
  const { name, define, ...otherProps } = removePrivateProps(props);

  const DefineComponent = defines[define];
  if (DefineComponent) {
    return <DefineComponent {...(otherProps as any)} name={name} key={name} />;
  } else {
    return null;
  }
});
