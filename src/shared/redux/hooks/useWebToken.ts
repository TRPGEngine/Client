import { useEffect } from 'react';
import _isEmpty from 'lodash/isEmpty';
import { fetchWebToken } from '@redux/actions/user';
import { useTRPGSelector, useTRPGDispatch } from './useTRPGSelector';

/**
 * 获取JWT
 */
export const useWebToken = () => {
  const jwt = useTRPGSelector((state) => state.user.webToken);
  const dispatch = useTRPGDispatch();

  useEffect(() => {
    if (_isEmpty(jwt)) {
      // 获取portalToken
      dispatch(fetchWebToken());
    }
  }, [jwt]);

  return jwt;
};
