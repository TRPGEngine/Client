import React, { useRef, useEffect } from 'react';
import { TiledMapManager } from './core/manager';
import './index.less';
import { ImageToken } from './layer/token';

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

    // ------------ test ------------
    const layer = tiledMapManager.addLayer('人物');
    const testToken = new ImageToken(
      '测试人物',
      'https://dss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=2807058697,2434741312&fm=58'
    );
    testToken.position = {
      x: 110,
      y: 110,
    };
    testToken.promise.then(() => {
      tiledMapManager.addToken('人物', testToken);
    });

    const layer2 = tiledMapManager.addLayer('背景');
    layer2.index = -1; // 应在人物下面
    const testToken2 = new ImageToken(
      '测试背景',
      'https://www.dytt8.net/images/m.jpg'
    );
    testToken2.position = {
      x: 50,
      y: 50,
    };
    testToken2.promise.then(() => {
      tiledMapManager.addToken('背景', testToken2);
    });

    // ------------ test ------------

    manager.current = tiledMapManager;
  }, []);

  return (
    <div className="tiledmap">
      <canvas ref={canvasRef}>请使用现代浏览器打开本页面</canvas>
    </div>
  );
});
TiledMap.displayName = 'TiledMap';
