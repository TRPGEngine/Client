import { useState, useEffect, useMemo } from 'react';
import _isObject from 'lodash/isObject';
import _isNil from 'lodash/isNil';
import _isEmpty from 'lodash/isEmpty';
import request from '@shared/utils/request';
import { getUrls } from '@shared/utils/string-helper';

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
    const urls = getUrls(rawMessage);
    if (urls.length > 0) {
      return urls[0]; // 只获取第一个
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
