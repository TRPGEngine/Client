import { LayoutProps } from '../processor';
import { parseMultilineText } from '../tags/utils';
import { useMemo } from 'react';
import { useLayoutFieldState } from './useLayoutFieldState';

export const useLayoutFormData = (props: LayoutProps) => {
  const label = useMemo(() => parseMultilineText(props.label ?? props.name), [
    props.label,
    props.name,
  ]);
  const placeholder = useMemo(
    () => parseMultilineText(props.placeholder ?? label),
    [props.placeholder, label]
  );
  const [stateValue, setStateValue] = useLayoutFieldState(props.name);

  return { label, placeholder, stateValue, setStateValue };
};
