import { TMemo } from '@shared/components/TMemo';
import { useLanguage } from '@shared/i18n/language';
import { Button, Divider } from 'antd';
import React from 'react';
import styled from 'styled-components';

const Root = styled.div`
  height: 40px;
  text-align: center;
`;

export const LanguageSwitchLink: React.FC = TMemo(() => {
  const { setLanguage } = useLanguage();

  const handleSwitchLanguage = async (lang: string) => {
    await setLanguage(lang);
    window.location.reload();
  };

  return (
    <Root>
      <Button type="link" onClick={() => handleSwitchLanguage('zh-CN')}>
        简体中文
      </Button>
      <Divider type="vertical" />
      <Button type="link" onClick={() => handleSwitchLanguage('en-US')}>
        English
      </Button>
    </Root>
  );
});
LanguageSwitchLink.displayName = 'LanguageSwitchLink';
