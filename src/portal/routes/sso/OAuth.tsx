import { LoginForm } from '@portal/components/LoginView/LoginForm';
import { checkTokenValid, getPortalJWTInfo } from '@portal/utils/auth';
import { TMemo } from '@shared/components/TMemo';
import Avatar from '@web/components/Avatar';
import React, { useCallback, useMemo } from 'react';
import { useAsync, useUpdate } from 'react-use';

const OAuthHasLogin: React.FC = TMemo(() => {
  const jwtInfo = useMemo(() => getPortalJWTInfo(), []);

  return (
    <div>
      <Avatar src={jwtInfo.avatar} name={jwtInfo.name} />
      <p>{jwtInfo.name}</p>
    </div>
  );
});
OAuthHasLogin.displayName = 'OAuthHasLogin';

const OAuthPage: React.FC = TMemo(() => {
  const forceUpdate = useUpdate();
  const { value: isTokenValid } = useAsync(() => {
    return checkTokenValid();
  }, []);

  const handleLoginSuccess = useCallback(() => {
    forceUpdate();
  }, [forceUpdate]);

  return (
    <div>
      {isTokenValid ? (
        <OAuthHasLogin />
      ) : (
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
});
OAuthPage.displayName = 'OAuthPage';

export default OAuthPage;
