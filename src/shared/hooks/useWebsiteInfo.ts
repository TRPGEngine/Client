import { useState, useEffect, useMemo } from 'react';
import bbcodeParser from '@shared/components/bbcode/parser';
import _isObject from 'lodash/isObject';
import _isNil from 'lodash/isNil';
import _isEmpty from 'lodash/isEmpty';
import { AstNodeObj } from '@shared/components/bbcode/type';
import request from '@shared/utils/request';

interface WebsiteInfo {
  title: string;
  content: string;
  icon?: string;
}

export const useWebsiteInfo = (rawMessage: string) => {
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<WebsiteInfo>(null);
  const messageUrl = useMemo(() => {
    if (rawMessage.indexOf('[url]') >= 0) {
      const ast = bbcodeParser.parse(rawMessage);
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
        setInfo(info);
      });
    }
  }, [hasUrl, messageUrl]);

  return {
    loading,
    hasUrl,
    info,
  };
};
