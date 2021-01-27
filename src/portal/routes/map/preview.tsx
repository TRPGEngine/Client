import React from 'react';
import { TiledMap } from '@shared/components/tiledmap';
import type { RouteComponentProps } from 'react-router-dom';

interface Props
  extends RouteComponentProps<{
    groupUUID: string;
    mapUUID: string;
  }> {}
const MapPreview: React.FC<Props> = React.memo((props) => {
  const { groupUUID, mapUUID } = props.match.params;

  return <TiledMap mapUUID={mapUUID} mode="preview" />;
});
MapPreview.displayName = 'MapPreview';

export default MapPreview;
