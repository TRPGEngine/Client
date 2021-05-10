import { useEffect, useState } from 'react';
import { checkTaroToken } from '../utils/auth';

export function useTaroAuthCheck() {
  const [valid, setValid] = useState(false);
  useEffect(() => {
    checkTaroToken()
      .then((isSuccess) => {
        setValid(isSuccess);
      })
      .catch((e) => {
        setValid(false);
      });
  }, []);

  return valid;
}
