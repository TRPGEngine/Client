import { TiledMapOptions } from './types';
import { TiledMapRender } from './render';
import _isNil from 'lodash/isNil';
import { Toolbox } from './toolbox';
import { LayerManager } from '../layer/manager';
import { Layer } from '../layer/Layer';
import { Token } from '../layer/token';

/**
 * TiledMap统一管理类
 * 包括工具，渲染
 */
export class TiledMapManager {
  static defaultOptions: Partial<TiledMapOptions> = {
    ratio: window.devicePixelRatio ?? 1,
    axis: {
      padding: {
        x: 10,
        y: 10,
      },
    },
  };

  public render: TiledMapRender;
  public toolbox = new Toolbox();
  private layerManager = new LayerManager();

  constructor(public el: HTMLCanvasElement, public options: TiledMapOptions) {
    this.options = {
      ...TiledMapManager.defaultOptions,
      ...options,
    };
    this.render = new TiledMapRender(el, this.options);
    this.render.layerManager = this.layerManager;

    this.toolbox.renderDom(el.parentElement);
    this.initEventListener();
  }

  initEventListener() {
    this.el.addEventListener('mousedown', (e) => {
      const { clientX: x, clientY: y } = e;
      // const { x: prevX, y: prevY } = this.render.position;

      const activityTool = this.toolbox.getCurrentTool();
      if (!_isNil(activityTool)) {
        activityTool.action({
          ...this.render.getDrawContext(),
          mousePos: { x, y },
        });
      }
    });
  }

  addLayer(name: string): Layer {
    const layer = new Layer(name);
    this.layerManager.appendLayer(layer);

    return layer;
  }

  addToken(layerName: string, token: Token): void {
    const layer = this.layerManager.getLayer(layerName);
    layer.appendToken(token);

    this.render.draw(); // 绘制图像
  }
}
