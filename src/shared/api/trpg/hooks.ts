import { useState, useEffect } from 'react';
import type { PlayerTokenInfo } from '@shared/types/player';
import _isString from 'lodash/isString';
import { getMapMemberSocketInfo } from './event';

export function useMapMemberSocketInfo(
  socketId: string
): PlayerTokenInfo | null {
  const [info, setInfo] = useState<PlayerTokenInfo | null>(null);

  useEffect(() => {
    if (!_isString(socketId)) {
      return;
    }

    getMapMemberSocketInfo(socketId).then((ret) => setInfo(ret));
  }, [socketId]);

  return info;
}
