import React, { Fragment } from 'react';
import bbcodeParser from './parser';
import urlRegex from 'url-regex';
import { emojify } from '@src/shared/utils/emoji';

/**
 * 客户端预处理文本
 * @param plainText 服务端文本
 */
export function preProcessText(plainText: string): string {
  let text = emojify(plainText); // 将:<emojicode>: 转化为 unicode字符
  text = text.replace(
    new RegExp(urlRegex({ exact: false, strict: true }), 'g'),
    '[url]$&[/url]'
  ); // 将聊天记录中的url提取成bbcode 需要过滤掉被bbcode包住的部分

  return text;
}

interface Props {
  plainText: string;
}
const BBCode: React.FC<Props> = React.memo(({ plainText }) => {
  const bbcodeComponent = bbcodeParser.render(
    bbcodeParser.preProcessText(plainText, preProcessText)
  );

  return <Fragment>{bbcodeComponent}</Fragment>;
});
BBCode.displayName = 'BBCode';

export default BBCode;
