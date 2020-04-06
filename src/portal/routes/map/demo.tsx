import React from 'react';
import { TiledMap } from '@shared/components/tiledmap';
import { RouteComponentProps } from 'react-router-dom';

interface Props
  extends RouteComponentProps<{
    mapUUID: string;
  }> {}
const MapDemo: React.FC<Props> = React.memo((props) => {
  const mapUUID = props.match.params.mapUUID;

  return <TiledMap mapUUID={mapUUID} />;
});
MapDemo.displayName = 'MapDemo';

export default MapDemo;
