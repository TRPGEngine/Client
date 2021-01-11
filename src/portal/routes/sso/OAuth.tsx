import { LoginForm } from '@portal/components/LoginView/LoginForm';
import { PortraitContainer } from '@portal/components/PortraitContainer';
import { checkTokenValid, getPortalJWTInfo } from '@portal/utils/auth';
import { TMemo } from '@shared/components/TMemo';
import Avatar from '@web/components/Avatar';
import { Button, Col, Divider, Row, Space, Typography } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import logoUrl from '@web/assets/img/logo@192.png';
import { CheckCircleFilled, UserOutlined } from '@ant-design/icons';
import qs from 'qs';
import { useLocation } from 'react-router';

// just for test
const authorizeApp = {
  name: 'DaoCloud',
  icon:
    'https://avatars0.githubusercontent.com/oa/144265?s=100&u=3060aa5cb71b05e5385cc1f3fa981af46e7319b3&v=4',
  website: 'https://api.daocloud.io',
  redirect: 'https://api.daocloud.io',
};

const OAuthHasLoginRoot = styled.div`
  /* text-align: center; */
`;

const OAuthHasLoginConnection = styled(Row).attrs({
  align: 'middle',
  justify: 'space-between',
})`
  padding: 24px 0;
  width: 300px;
  margin: auto;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    width: 100%;
    border-top: ${(props) => props.theme.border.standard};
    border-top-width: 2px;
    border-top-style: dashed;
  }
`;

const OAuthHasLoginInfo = styled.div`
  border: ${(props) => props.theme.border.standard};
  border-radius: ${(props) => props.theme.radius.card};
  padding: 24px;

  > .ant-row {
    margin-bottom: 12px;
  }
`;

function useOAuthParams() {
  const { search } = useLocation();
  const { scope: scopeStr = '' } = useMemo(() => {
    return qs.parse(search, { ignoreQueryPrefix: true });
  }, [search]);

  return {
    scope: scopeStr.split(','),
  };
}

const OAuthHasLogin: React.FC = TMemo(() => {
  const jwtInfo = useMemo(() => getPortalJWTInfo(), []);
  const { scope } = useOAuthParams();

  const handleAuthorize = useCallback(() => {
    console.log('授权结果:', scope);
  }, [scope]);

  return (
    <OAuthHasLoginRoot>
      <OAuthHasLoginConnection>
        <Avatar size={96} src={authorizeApp.icon} name={authorizeApp.name} />

        <CheckCircleFilled
          style={{ color: '#28a745', zIndex: 1, fontSize: 32 }}
        />

        <Avatar size={96} src={logoUrl} name="TRPG Engine" />
      </OAuthHasLoginConnection>

      <Typography.Title level={3} style={{ textAlign: 'center' }}>
        授权 {authorizeApp.name}
      </Typography.Title>

      <OAuthHasLoginInfo>
        <Row align="middle">
          <Space>
            <Col>
              <Avatar src={jwtInfo.avatar} name={jwtInfo.name} />
            </Col>
            <Col>
              <p>
                {authorizeApp.name} by{' '}
                <Button type="link" href={authorizeApp.website}>
                  {authorizeApp.website}
                </Button>
              </p>
              <Typography.Text>
                想要访问你的 {jwtInfo.name} 账户
              </Typography.Text>
            </Col>
          </Space>
        </Row>

        {/* 访问内容 scope */}

        {scope.includes('public') && (
          <Row align="middle">
            <UserOutlined />
            <Typography.Text>公开的账户信息</Typography.Text>
          </Row>
        )}

        <Divider />

        <Row>
          <Button
            type="primary"
            block={true}
            size="large"
            onClick={handleAuthorize}
          >
            授权
          </Button>
        </Row>

        <Typography.Text>
          Authorizing will redirect to{' '}
          <a href={authorizeApp.redirect}>{authorizeApp.redirect}</a>
        </Typography.Text>
      </OAuthHasLoginInfo>
    </OAuthHasLoginRoot>
  );
});
OAuthHasLogin.displayName = 'OAuthHasLogin';

function useTokenValid() {
  const [isTokenValid, setIsTokenValid] = useState(false);

  const updateTokenValid = useCallback(async () => {
    const isValid = await checkTokenValid();
    setIsTokenValid(isValid);
  }, []);

  useEffect(() => {
    updateTokenValid();
  }, []);

  return {
    isTokenValid,
    updateTokenValid,
  };
}

const OAuthPage: React.FC = TMemo(() => {
  const { isTokenValid, updateTokenValid } = useTokenValid();

  const handleLoginSuccess = useCallback(() => {
    updateTokenValid();
  }, []);

  return (
    <PortraitContainer>
      {isTokenValid ? (
        <OAuthHasLogin />
      ) : (
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      )}
    </PortraitContainer>
  );
});
OAuthPage.displayName = 'OAuthPage';

export default OAuthPage;
