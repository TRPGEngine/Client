import { useEffect } from 'react';
import { checkTaroToken } from '../utils/auth';

export function useTaroAuthCheck() {
  useEffect(() => {
    checkTaroToken();
  }, []);
}
