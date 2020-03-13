import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TRPGState } from '@redux/types/__all__';
import _isEmpty from 'lodash/isEmpty';
import { fetchWebToken } from '@redux/actions/user';

/**
 * 获取JWT
 */
export const useWebToken = () => {
  const jwt = useSelector<TRPGState, string>((state) => state.user.webToken);
  const dispatch = useDispatch();

  useEffect(() => {
    if (_isEmpty(jwt)) {
      // 获取portalToken
      dispatch(fetchWebToken());
    }
  }, [jwt]);

  return jwt;
};
