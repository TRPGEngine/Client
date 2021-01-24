import { useSelector, useDispatch } from 'react-redux';
import type { TRPGState, TRPGDispatch } from '@redux/types/__all__';

/**
 * TRPG选择器
 */
export function useTRPGSelector<T>(
  selector: (state: TRPGState) => T,
  equalityFn?: (left: T, right: T) => boolean
) {
  return useSelector<TRPGState, T>(selector, equalityFn);
}

export function useTRPGDispatch() {
  return useDispatch<TRPGDispatch>();
}
