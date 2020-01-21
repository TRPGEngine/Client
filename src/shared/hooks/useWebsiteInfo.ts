import { useState, useEffect, useMemo } from 'react';
import _isObject from 'lodash/isObject';
import _isNil from 'lodash/isNil';
import _isEmpty from 'lodash/isEmpty';
import request from '@shared/utils/request';
import { preProcessText } from '@shared/components/bbcode';
import bbcodeParser from '@shared/components/bbcode/parser';
import { AstNodeObj } from '@shared/components/bbcode/type';

interface WebsiteInfo {
  title: string;
  content: string;
  icon?: string;
  url: string;
}

export const useWebsiteInfo = (rawMessage: string) => {
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<WebsiteInfo>({
    title: '',
    content: '',
    url: '',
  });
  const messageUrl = useMemo(() => {
    // 此处使用bbcode解释器作为获取Url的操作。
    // 不直接通过正则获取url是因为可能会获取到图片url之类的其他地图
    const message = preProcessText(rawMessage);

    if (message.indexOf('[url]') >= 0) {
      const ast = bbcodeParser.parse(message);
      const urlTag = ast.find(
        (node) => _isObject(node) && node.tag === 'url'
      ) as AstNodeObj; // 只取第一个

      if (_isNil(urlTag)) {
        return '';
      }

      return urlTag.content.join('');
    }

    return '';
  }, [rawMessage]);

  const hasUrl = useMemo(() => !_isEmpty(messageUrl), [messageUrl]);

  useEffect(() => {
    if (hasUrl) {
      // 如果messageUrl有值的话则获取
      setLoading(true);
      // TODO: 可能需要缓存
      request(`/info/website/info?url=${messageUrl}`).then((res) => {
        setLoading(false);
        const info = res.data.info;
        setInfo({ ...info, url: messageUrl });
      });
    }
  }, [hasUrl, messageUrl]);

  return {
    loading,
    hasUrl,
    info,
  };
};
