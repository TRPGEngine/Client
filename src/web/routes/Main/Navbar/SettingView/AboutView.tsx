import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { Typography } from 'antd';
import { useTranslation } from '@shared/i18n';
import { PWAButton } from '@web/components/PWAButton';
import config from '@shared/project.config';

const { Title, Paragraph, Link } = Typography;

export const AboutView: React.FC = TMemo(() => {
  const { t } = useTranslation();

  return (
    <div>
      <Title level={3}>{t('关于')}</Title>

      <Paragraph>TRPG Engine 是一款完全免费且完全开源的</Paragraph>
      <Paragraph>专为跑团而生的即时通讯软件</Paragraph>
      <Paragraph>
        如果你有什么好的建议或者意见, 可以来 QQ群:{' '}
        <Link
          href="https://shang.qq.com/wpa/qunwpa?idkey=7be5cfe70436a65c965ae9c86d9e6cfc36c16258634a42897724dce026accf3d"
          target="_blank"
        >
          387587760
        </Link>{' '}
        来找到开发者, 提出你的建议或者意见
      </Paragraph>

      <Paragraph>
        本项目尚在不断完善中，现有的产品不代表最终实际效果。TRPG
        Engine会根据不断的场景变更与迭代来不断完善自己。
      </Paragraph>

      <Paragraph>
        <PWAButton />
      </Paragraph>

      <Paragraph>当前版本: v{config.version}</Paragraph>
    </div>
  );
});
AboutView.displayName = 'AboutView';
