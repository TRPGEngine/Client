import React, { useEffect, useState, useCallback, Fragment } from 'react';
import type { RouteComponentProps } from 'react-router-dom';
import { fetchLatestVersion, DeployVersion } from '@portal/model/deploy';
import { Button } from 'antd';
import { downloadFileWeb } from '@shared/utils/file-helper';
import _isEmpty from 'lodash/isEmpty';
import Loading from '@portal/components/Loading';
import { QRCode } from '@portal/components/QRCode';

interface Props extends RouteComponentProps {}

const DeployLatest: React.FC<Props> = React.memo((props) => {
  const [version, setVersion] = useState<Partial<DeployVersion>>({});

  useEffect(() => {
    fetchLatestVersion().then((version) => setVersion(version));
  }, []);

  const handleClick = useCallback(() => {
    downloadFileWeb(version.download_url!);
  }, [version.download_url]);

  return (
    <div style={{ textAlign: 'center', padding: 20 }}>
      {_isEmpty(version) ? (
        <Loading />
      ) : (
        <Fragment>
          <div>
            {version.download_url ? (
              <QRCode value={version.download_url} />
            ) : (
              <img
                src="/src/web/assets/img/logo@192.png"
                width="96"
                height="96"
              />
            )}
          </div>
          <div>{version.version}</div>
          <div>{version.platform}</div>
          <div>{version.describe}</div>
          {version.download_url ? (
            <div>
              <Button
                type="primary"
                size="large"
                block={true}
                onClick={handleClick}
              >
                立即下载
              </Button>
            </div>
          ) : null}
        </Fragment>
      )}
    </div>
  );
});
DeployLatest.displayName = 'DeployLatest';

export default DeployLatest;
