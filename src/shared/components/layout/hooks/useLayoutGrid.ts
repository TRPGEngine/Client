import { useContext, useMemo } from 'react';
import { LayoutWidthContext } from '@shared/components/layout/context/LayoutWidthContext';
import _isNil from 'lodash/isNil';
import _isEmpty from 'lodash/isEmpty';
import { tryToNumber } from '../tags/utils';

/**
 * 预处理props的xs sm md lg xl xxl
 * 这些东西都是基于窗口大小来进行处理的
 * 将这些项目根据layout组件大小变成span等属性
 * https://getbootstrap.com/docs/4.0/layout/overview/#responsive-breakpoints
 */

export const useLayoutGrid = (props: {}) => {
  const layoutWidth = useContext(LayoutWidthContext);

  const span = useMemo(() => {
    let newSpan = props['span'] ?? 24;
    const keys = Object.keys(props);

    if (keys.includes('xxl') && layoutWidth >= 1600) {
      newSpan = props['xxl'];
    }

    if (keys.includes('xl') && layoutWidth >= 1200) {
      newSpan = props['xl'];
    }

    if (keys.includes('lg') && layoutWidth >= 992) {
      newSpan = props['lg'];
    }

    if (keys.includes('md') && layoutWidth >= 768) {
      newSpan = props['md'];
    }

    if (keys.includes('sm') && layoutWidth >= 576) {
      newSpan = props['sm'];
    }

    if (keys.includes('xs') && layoutWidth < 576) {
      newSpan = props['xs'];
    }

    return tryToNumber(newSpan);
  }, [layoutWidth]);

  const ret = {
    ...props,
    span,
  };
  delete ret['xxl'];
  delete ret['xl'];
  delete ret['lg'];
  delete ret['md'];
  delete ret['sm'];
  delete ret['xs'];

  if (_isEmpty(props)) {
    // 默认布局
    return {};
  } else if (!_isNil(props['flex'])) {
    // flex布局
    return { flex: tryToNumber(props['flex']) };
  } else {
    return ret;
  }
};
