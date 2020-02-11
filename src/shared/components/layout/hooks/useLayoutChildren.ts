import { useMemo, ReactNode, useContext } from 'react';
import { LayoutProps, render } from '../processor';
import _get from 'lodash/get';
import _set from 'lodash/set';
import _isEmpty from 'lodash/isEmpty';
import { LayoutStateContext } from '../context/LayoutStateContext';

// 生成子元素唯一key
function childrenKey(parentName: string, childrenName: string, index: number) {
  return `${parentName}-${childrenName}-${index}`;
}

export const useLayoutChildren = (props: LayoutProps): ReactNode => {
  const stateContext = useContext(LayoutStateContext);

  const children = useMemo(() => {
    if (_isEmpty(props._childrenEl)) {
      return null;
    }

    return props._childrenEl.map((el, index) => {
      if (!_get(el, 'attributes.key')) {
        _set(el, 'attributes.key', childrenKey(props._name, el.name, index)); // 增加一个默认的key
      }

      // NOTE: 所有的组件返回的实例都应当有key. 因为这个元素是map出来的
      return render(el, stateContext);
    });
  }, [props, stateContext]);

  return children;
};
