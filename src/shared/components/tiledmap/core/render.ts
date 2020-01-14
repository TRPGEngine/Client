import { Size, Position, Axios } from './types';

interface TiledMapOptions {
  size: Size; // 应当是gridSize的整数倍
  gridSize: Size;
  ratio?: number; // 绘制精度, 越大越精细但是消耗资源越高
  axis?: {
    padding: Axios;
  };
}

export class TiledMapRender {
  static defaultOptions: Partial<TiledMapOptions> = {
    ratio: window.devicePixelRatio ?? 1,
    axis: {
      padding: {
        x: 10,
        y: 10,
      },
    },
  };

  private ctx: CanvasRenderingContext2D;
  public position: Position = { x: 0, y: 0 };
  private _originOptions?: TiledMapOptions;
  public options: TiledMapOptions;

  constructor(private el: HTMLCanvasElement, options: TiledMapOptions) {
    this.ctx = el.getContext('2d');
    this.options = {
      ...TiledMapRender.defaultOptions,
      ...options,
    };

    this.init();
    this.render();
    this.addEventListener();
  }

  /**
   * 初始化元素的一些基本信息与全局配置
   */
  init() {
    const el = this.el;
    const options = this.options;
    const ratio = options.ratio;

    el.style.cursor = 'all-scroll';
    this.ctx.scale(ratio, ratio);
    el.width = options.size.width * ratio;
    el.height = options.size.height * ratio;

    // 设置canvas实际尺寸为渲染面积一半大小
    // el.style.transform = `scale(${1 / ratio})`;
    // el.style.transformOrigin = '0 0';
    el.style.width = options.size.width + 'px';
    el.style.height = options.size.height + 'px';

    this.resetOptionSize();
  }

  /**
   * 将options的数据根据ratio进行缩放
   */
  resetOptionSize() {
    const options = this.options;
    this._originOptions = options;
    const { ratio, size, gridSize, axis } = options;

    this.options = {
      ...this.options,
      size: {
        width: size.width * ratio,
        height: size.height * ratio,
      },
      gridSize: {
        width: gridSize.width * ratio,
        height: gridSize.height * ratio,
      },
      axis: {
        padding: {
          x: axis.padding.x * ratio,
          y: axis.padding.y * ratio,
        },
      },
    };
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

    for (let x = 0, xi = 1; x < width; x = x + interval.width, xi++) {
      // x轴
      const text = String(xi);
      const { width: textWidth } = ctx.measureText(text);
      const offsetX = -textWidth / 2 + interval.width / 2; // 左边相对移动距离

      ctx.fillText(
        text,
        x + offsetX,
        windowRelativePos.y < -padding.y
          ? 0 - padding.y
          : windowRelativePos.y + fontSize
      );
    }

    for (let y = 0, yi = 1; y < height; y = y + interval.height, yi++) {
      // y轴
      const text = String(yi);
      const { width: textWidth } = ctx.measureText(text);
      const offsetY = fontSize / 2 + interval.height / 2; // 上下相对移动距离

      ctx.fillText(
        text,
        windowRelativePos.x < -padding.x
          ? -textWidth - padding.x
          : windowRelativePos.x,
        y + offsetY
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
