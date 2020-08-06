import { useRNStorage } from './useRNStorage';

/**
 * 内测用户状态的hook
 */
export function useAlphaUser() {
  const [isAlphaUser, setIsAlphaUser] = useRNStorage<boolean>(
    'isAlphaUser',
    false,
    true
  );

  return { isAlphaUser: isAlphaUser!, setIsAlphaUser };
}
