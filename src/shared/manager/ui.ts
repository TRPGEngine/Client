import { buildRegFn } from './buildRegFn';

type ToastsType = 'info' | 'success' | 'error' | 'warning';
export const [showToasts, setToasts] = buildRegFn<
  (message: string, type?: ToastsType) => void
>('toasts');
