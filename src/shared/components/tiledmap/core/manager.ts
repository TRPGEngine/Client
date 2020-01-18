import { TiledMapOptions } from './types';
import { TiledMapRender } from './render';
import { TiledMapToolBase } from '../tools/base';
import _isNil from 'lodash/isNil';

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
  private tools: TiledMapToolBase[] = [];
  private currentTool = '';

  constructor(public el: HTMLCanvasElement, public options: TiledMapOptions) {
    this.options = {
      ...TiledMapManager.defaultOptions,
      ...options,
    };
    this.render = new TiledMapRender(el, this.options);

    this.initEventListener();
  }

  initEventListener() {
    this.el.addEventListener('mousedown', (e) => {
      const { clientX: x, clientY: y } = e;
      // const { x: prevX, y: prevY } = this.render.position;

      const activityTool = this.getCurrentTool();
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

  /**
   * 注册工具
   */
  regTool(tool: TiledMapToolBase) {
    this.tools.push(tool);
  }

  /**
   * 设置当前使用的工具
   * @param toolName 工具名
   */
  setCurrentTool(toolName: string) {
    this.currentTool = toolName;
  }

  /**
   * 获取当前的工具
   */
  getCurrentTool(): TiledMapToolBase | null {
    return this.tools.find((tool) => tool.name === this.currentTool);
  }
}
