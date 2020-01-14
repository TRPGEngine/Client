import { Size, Position, Axios } from './types';

interface TiledMapOptions {
  size: Size;
  gridSize: Size;
  axis?: {
    padding: Axios;
  };
}

export class TiledMapRender {
  static defaultOptions: Partial<TiledMapOptions> = {
    axis: {
      padding: {
        x: 10,
        y: 10,
      },
    },
  };

  private ctx: CanvasRenderingContext2D;
  public position: Position = { x: 0, y: 0 };
  public options: TiledMapOptions;

  constructor(private el: HTMLCanvasElement, options: TiledMapOptions) {
    this.ctx = el.getContext('2d');
    this.options = {
      ...TiledMapRender.defaultOptions,
      ...options,
    };

    // init
    el.style.cursor = 'all-scroll';
    this.render();
    this.addEventListener();
  }

  addEventListener() {
    this.el.addEventListener('mousedown', (e) => {
      const { clientX, clientY } = e;
      const { x: prevX, y: prevY } = this.position;

      const handleMouseMove = (e: MouseEvent) => {
        const deltaX = e.clientX - clientX;
        const deltaY = e.clientY - clientY;
        this.setPosition({
          x: prevX + deltaX,
          y: prevY + deltaY,
        });
        this.render();
      };

      const handleMouseLeave = (e: MouseEvent) => {
        this.el.removeEventListener('mousemove', handleMouseMove);
        this.el.removeEventListener('mouseup', handleMouseLeave);
        this.el.removeEventListener('mouseleave', handleMouseLeave);
      };

      this.el.addEventListener('mousemove', handleMouseMove);
      this.el.addEventListener('mouseup', handleMouseLeave);
      this.el.addEventListener('mouseleave', handleMouseLeave);
    });
  }

  /**
   * 渲染所有的图形
   */
  render() {
    this.clear();
    this.resetTranslate();

    this.drawGrid();
    this.drawAxis();
  }

  /**
   * 绘制网格
   */
  drawGrid() {
    const ctx = this.ctx;
    const interval = this.options.gridSize;
    const { width, height } = this.options.size;

    ctx.strokeStyle = '#cccccc';
    ctx.lineWidth = 1;
    ctx.beginPath();

    for (let x = 0; x <= width; x = x + interval.width) {
      if (x === width) {
        x--;
      }

      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = 0; y <= height; y = y + interval.height) {
      if (y === height) {
        y--;
      }

      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }

  /**
   * 绘制坐标轴
   */
  drawAxis() {
    const ctx = this.ctx;
    const interval = this.options.gridSize;
    const { width, height } = this.options.size;
    const padding = this.options.axis.padding;

    const fontSize = 18;

    ctx.font = `${fontSize}px '微软雅黑'`;
    ctx.fillStyle = '#cccccc';
    ctx.lineWidth = 1;

    const windowRelativePos = this.getWindowRelativePosition();

    for (let x = 0; x <= width; x = x + interval.width) {
      // x轴
      const text = String(x);
      const { width: textWidth } = ctx.measureText(text);
      const deltaLeft = textWidth / 2;

      ctx.fillText(
        text,
        x - deltaLeft,
        windowRelativePos.y < -padding.y
          ? 0 - padding.y
          : windowRelativePos.y + fontSize
      );
    }

    for (let y = 0; y <= height; y = y + interval.height) {
      // y轴
      const text = String(y);
      const { width: textWidth } = ctx.measureText(text);
      const deltaBottom = fontSize / 2;

      ctx.fillText(
        text,
        windowRelativePos.x < -padding.x
          ? -textWidth - padding.x
          : windowRelativePos.x,
        y + deltaBottom
      );
    }
  }

  /**
   * 获取在实际窗口上左上角的坐标
   */
  getWindowRelativePosition(): Position {
    const pos = this.position;
    return {
      x: -pos.x,
      y: -pos.y,
    };
  }

  setPosition(pos: Position) {
    this.position = pos;
  }

  // 设置变换为程序定义的(0, 0)坐标
  resetTranslate() {
    const { x, y } = this.position;
    this.ctx.resetTransform();
    this.ctx.translate(x + 0.5, y + 0.5); // 增加0.5以保证线绘制点不在边上
  }

  // 清除画布
  clear() {
    this.el.width = this.el.width; // 使用触发dom重绘来清除画布。更加暴力
  }
}
