import React, { useEffect, useMemo } from 'react';
import Webview from './Webview';
import config from '@shared/project.config';
import _isString from 'lodash/isString';
import _isEmpty from 'lodash/isEmpty';
import { useWebToken } from '@shared/hooks/useWebToken';

interface PortalViewProps {
  url: string;
}
export const PortalView: React.FC<PortalViewProps> = React.memo((props) => {
  const jwt = useWebToken();

  const url = useMemo(() => {
    if (_isString(props.url) && props.url.startsWith('/')) {
      return config.url.portal + props.url;
    }

    return props.url;
  }, [props.url]);

  if (_isEmpty(jwt)) {
    return <div />;
  }

  return <Webview src={url} allowExopen={false} />;
});
PortalView.displayName = 'PortalView';
