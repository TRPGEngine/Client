import React, { useContext } from 'react';
import type { TagComponent } from '../type';
import { LayoutStateContext } from '../../context/LayoutStateContext';
import { removePrivateProps } from '../utils';
import { TMemo } from '@shared/components/TMemo';

interface UseDefineComponentProps {
  name: string; // 用于存储数据
  define: string; //
  [useProps: string]: any;
}
export const UseDefineComponent: React.FC<UseDefineComponentProps> = TMemo(
  (props) => {
    const context = useContext(LayoutStateContext)!;
    const defines = context.state.defines;
    const { name, define, ...useProps } = props;

    const DefineComponent = defines[define];
    if (DefineComponent) {
      return <DefineComponent {...useProps} name={name} key={name} />;
    } else {
      return null;
    }
  }
);
UseDefineComponent.displayName = 'UseDefineComponent';

export const TagUseShared: TagComponent<UseDefineComponentProps> = TMemo(
  (props) => {
    const useProps = removePrivateProps(props);

    return (
      <UseDefineComponent
        {...useProps}
        name={props.name}
        define={props.define}
      />
    );
  }
);
TagUseShared.displayName = 'TagUseShared';
