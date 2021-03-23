import { IS_ALPHA_USER } from '@shared/utils/consts';
import { useStorage } from './useStorage';

/**
 * 内测用户状态的hook
 */
export function useAlphaUser() {
  const [isAlphaUser, setIsAlphaUser] = useStorage<boolean>(
    IS_ALPHA_USER,
    false,
    true
  );

  return { isAlphaUser: isAlphaUser!, setIsAlphaUser };
}
