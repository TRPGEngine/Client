import React from 'react';
import { TiledMap } from '@shared/components/tiledmap';

const MapDemo: React.FC = React.memo(() => {
  return <TiledMap mapUUID="test" />;
});
MapDemo.displayName = 'MapDemo';

export default MapDemo;
