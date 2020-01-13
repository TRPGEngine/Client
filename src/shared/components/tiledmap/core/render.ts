import { Size } from './types';

interface TiledMapOptions {
  size: Size;
}

interface GridOptions {
  interval: Size;
  width: number;
  height: number;
}

export class TiledMapRender {
  private ctx: CanvasRenderingContext2D;
  constructor(private el: HTMLCanvasElement, public options: TiledMapOptions) {
    this.ctx = el.getContext('2d');

    this.drawGrid({
      interval: {
        x: 40,
        y: 40,
      },
      width: options.size.x,
      height: options.size.y,
    });
  }

  /**
   * 绘制网格
   */
  drawGrid(options: GridOptions) {
    const { interval, width, height } = options;
    const ctx = this.ctx;

    this.clear();

    ctx.translate(0.5, 0.5);

    ctx.strokeStyle = '#cccccc';
    ctx.lineWidth = 1;
    ctx.beginPath();

    for (let x = 0; x <= width + 1; x = x + interval.x) {
      console.log('x', x);
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = 0; y <= width + 1; y = y + interval.y) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    ctx.closePath();
  }

  clear() {
    this.ctx.clearRect(0, 0, this.el.width, this.el.height);
  }
}
