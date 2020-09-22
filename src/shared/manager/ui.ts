import { buildRegFn } from './buildRegFn';

/**
 * 通用UI api设置
 */

type ToastsType = 'info' | 'success' | 'error' | 'warning';
export const [showToasts, setToasts] = buildRegFn<
  (message: string, type?: ToastsType) => void
>('toasts');

interface AlertOptions {
  message: React.ReactNode;
  onConfirm?: () => void | Promise<void>;
}
export const [showAlert, setAlert] = buildRegFn<
  (options: AlertOptions) => void
>('alert');
