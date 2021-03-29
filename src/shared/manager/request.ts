import { buildRegFn } from './buildRegFn';

export const [getErrorHook, setErrorHook] = buildRegFn<(err: any) => boolean>(
  'requestErrorHook',
  () => true
);

export const [tokenGetter, setTokenGetter] = buildRegFn<() => Promise<string>>(
  'requestTokenGetter'
);
