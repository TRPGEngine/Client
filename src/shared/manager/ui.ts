import { buildRegFn } from './buildRegFn';

/**
 * 通用UI api设置
 */

type ToastsType = 'info' | 'success' | 'error' | 'warning';
export const [showToasts, setToasts] = buildRegFn<
  (message: string, type?: ToastsType) => void
>('toasts');
