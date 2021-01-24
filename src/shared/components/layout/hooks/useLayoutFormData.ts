import type { LayoutProps } from '../processor';
import { parseMultilineText } from '../tags/utils';
import { useMemo, useEffect } from 'react';
import { useLayoutFieldState } from './useLayoutFieldState';
import _isNil from 'lodash/isNil';

export const useLayoutFormLabel = (props: LayoutProps): string => {
  const label = useMemo(() => parseMultilineText(props.label ?? props.name), [
    props.label,
    props.name,
  ]);

  return label;
};

export const useLayoutFormData = (props: LayoutProps) => {
  const label = useLayoutFormLabel(props);

  const placeholder = useMemo(
    () => parseMultilineText(props.placeholder ?? label),
    [props.placeholder, label]
  );
  const [stateValue, setStateValue] = useLayoutFieldState(props.name);

  // 处理默认值
  useEffect(() => {
    if (!_isNil(props.default) && _isNil(stateValue)) {
      setStateValue(props.default);
    }
  }, [props.default]);

  return {
    label,
    placeholder,
    stateValue,
    setStateValue,
  };
};
