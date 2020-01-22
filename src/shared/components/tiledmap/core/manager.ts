import { TiledMapOptions } from './types';
import { TiledMapRender } from './render';
import _isNil from 'lodash/isNil';
import { Toolbox } from './toolbox';

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

  constructor(public el: HTMLCanvasElement, public options: TiledMapOptions) {
    this.options = {
      ...TiledMapManager.defaultOptions,
      ...options,
    };
    this.render = new TiledMapRender(el, this.options);

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
          canvasPos: this.render.position,
          mousePos: { x, y },
          el: this.el,
          render: this.render,
          ratio: this.options.ratio,
        });
      }
    });
  }
}
