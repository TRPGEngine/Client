import React, { useState, useEffect, PropsWithChildren, Fragment } from 'react';
import rnStorage from '@src/shared/api/rn-storage.api';

// 仅对内测用户显示
const DevContainer = (props: PropsWithChildren<{}>): React.ReactElement => {
  const [isAlphaUser, setIsAlphaUser] = useState<boolean>(false);

  useEffect(() => {
    rnStorage
      .get('isAlphaUser', false)
      .then((isAlphaUser) => setIsAlphaUser(isAlphaUser));
  }, []);

  return isAlphaUser ? <Fragment>{props.children}</Fragment> : null;
};

export default DevContainer;
