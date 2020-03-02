import { useCallback, useContext, useMemo } from 'react';
import { LayoutStateContext } from '../context/LayoutStateContext';
import _get from 'lodash/get';
import { getStateValue, setStateValue } from '../tags/utils';

type FieldValue = string | number;
export const useLayoutFieldState = (
  name: string
): [FieldValue, (newValue: any) => void] => {
  const context = useContext(LayoutStateContext);

  const value = useMemo(() => getStateValue(context, name), [
    name,
    context.state.data,
  ]);
  const setValue = useCallback(
    (newValue) => {
      setStateValue(context, name, newValue);
    },
    [name, context.dispatch]
  );

  return [value, setValue];
};
