import React, { useRef, useEffect } from 'react';
import { TiledMapManager } from './core/manager';
import { regAllTool } from './tools/__all__';

export const TiledMap: React.FC = React.memo((props) => {
  const canvasRef = useRef<HTMLCanvasElement>();
  const manager = useRef<TiledMapManager>(null);

  useEffect(() => {
    const tiledMapManager = new TiledMapManager(canvasRef.current, {
      size: {
        width: 20,
        height: 15,
      },
      gridSize: {
        width: 40,
        height: 40,
      },
    });
    regAllTool(tiledMapManager);

    manager.current = tiledMapManager;
  }, []);

  return (
    <div>
      <canvas ref={canvasRef}>请使用现代浏览器打开本页面</canvas>
    </div>
  );
});
TiledMap.displayName = 'TiledMap';
