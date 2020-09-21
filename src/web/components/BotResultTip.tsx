import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import config from '@shared/project.config';
import { Typography } from 'antd';

interface BotResultTipProps {
  name: string;
  token: string;
}

/**
 * 创建机器人结果提示
 */

export const BotResultTip: React.FC<BotResultTipProps> = TMemo((props) => {
  const { name, token } = props;

  const requestUrl = `${config.url.api}/bot/msg/send`;
  const getUrl = `${requestUrl}?token=${token}&msg=${encodeURI('Hello World')}`;

  return (
    <div>
      <span>创建机器人{name}完毕</span>
      <span>唯一标识: {token}</span>

      <div>尝试以下方式使用机器人</div>
      <p>
        <span>简单访问:</span>
        <Typography.Link href={getUrl} target="_blank">
          {getUrl}
        </Typography.Link>
      </p>
      <p>或发送POST请求到{requestUrl}</p>
    </div>
  );
});
BotResultTip.displayName = 'BotResultTip';
