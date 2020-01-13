import React, { useRef, useEffect } from 'react';
import { TiledMapRender } from './core/render';

export const TiledMap: React.FC = React.memo((props) => {
  const canvasRef = useRef<HTMLCanvasElement>();

  useEffect(() => {
    const render = new TiledMapRender(canvasRef.current, {
      size: {
        x: 800,
        y: 600,
      },
    });
  }, []);

  return <canvas ref={canvasRef} width={800} height={600} />;
});
TiledMap.displayName = 'TiledMap';
