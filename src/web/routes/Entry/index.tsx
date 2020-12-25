import React, { useEffect } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { Route, Switch } from 'react-router-dom';
import { LoginView } from './Login';
import { RegisterView } from './Register';
import styled from 'styled-components';
import { HiddenInMobile } from '@web/components/HiddenInMobile';
import Webview from '@web/components/Webview';
import config from '@shared/project.config';
import { Redirect, useHistory } from 'react-router';
import { useTRPGSelector } from '@shared/hooks/useTRPGSelector';
import loginPatternUrl from '../../assets/img/login-pattern.svg';
import { Button, Space } from 'antd';
import { LanguageSwitchLink } from '@web/components/LanguageSwitchLink';
import { t } from '@shared/i18n';

const Root = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
`;

const BaseContainer = styled.div`
  background-color: ${(props) => props.theme.color.graySet[7]};
  height: 100vh;
  width: 568px;
  padding: 10vh 100px 0;
  background-image: url(${loginPatternUrl});
  background-repeat: repeat-y;
  position: relative;

  ${({ theme }) => theme.mixins.mobile('width: 100%;padding: 10vh 20px 0;')};

  .ant-input,
  .ant-input-password {
    background-color: ${(props) => props.theme.color.graySet[7]};
  }
`;

const InfoContainer = styled.div`
  flex: 1;
  background-color: white;
`;

const Footer = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 10px;

  > .home-page {
    position: absolute;
    right: 0;
    bottom: 0;
  }
`;

function useWatchLoginStatus() {
  const history = useHistory();
  const isLogin = useTRPGSelector((state) => state.user.isLogin);
  useEffect(() => {
    if (isLogin === true) {
      history.replace('/main');
    }
  }, [isLogin]);
}

export const EntryRoute: React.FC = TMemo(() => {
  useWatchLoginStatus();

  return (
    <Root>
      <BaseContainer>
        <Switch>
          <Route name="login" path="/entry/login" component={LoginView} />
          <Route
            name="register"
            path="/entry/register"
            component={RegisterView}
          />
          <Redirect to="/entry/login" />
        </Switch>

        <Footer>
          <LanguageSwitchLink />

          <Button
            className="home-page"
            type="link"
            onClick={() => window.open(config.url.homepage)}
          >
            {t('官方网站')}
          </Button>
        </Footer>
      </BaseContainer>

      <HiddenInMobile>
        <InfoContainer>
          <Webview src={config.url.loginUrl} />
        </InfoContainer>
      </HiddenInMobile>
    </Root>
  );
});
EntryRoute.displayName = 'EntryRoute';
