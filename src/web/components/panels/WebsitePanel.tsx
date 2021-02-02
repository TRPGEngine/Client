import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import type { CommonPanelProps } from '@shared/components/panel/type';
import { useCurrentGroupUUID } from '@shared/context/GroupInfoContext';
import type { CommonGroupPanelData } from '@shared/model/group';
import _isString from 'lodash/isString';
import { Loading } from '../Loading';
import { useCommonGroupPanelData } from './useCommonGroupPanelData';
import { AlertErrorMessage } from '../AlertErrorView';
import Webview from '../Webview';
import { CommonPanel } from './CommonPanel';

interface WebsitePanelData extends CommonGroupPanelData {
  url: string;
}

/**
 * 网页面板
 */
export const WebsitePanel: React.FC<CommonPanelProps> = TMemo((props) => {
  const { panel } = props;
  const { uuid: panelUUID, name: channelName } = panel;
  const groupUUID = useCurrentGroupUUID();

  const {
    panelData,
    panelDataLoading,
    panelDataError,
  } = useCommonGroupPanelData<WebsitePanelData>(groupUUID, panelUUID);

  if (panelDataLoading) {
    return <Loading />;
  }

  if (panelDataError) {
    return <AlertErrorMessage error={panelDataError} />;
  }

  const url = panelData.url;
  return (
    <CommonPanel header={channelName}>
      <Webview src={url} allowExopen={true} />
    </CommonPanel>
  );
});
WebsitePanel.displayName = 'WebsitePanel';
