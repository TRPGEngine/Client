import { Size, Position } from './types';

interface TiledMapOptions {
  size: Size;
  gridSize: Size;
}

export class TiledMapRender {
  private ctx: CanvasRenderingContext2D;
  public position: Position = { x: 0, y: 0 };
  constructor(private el: HTMLCanvasElement, public options: TiledMapOptions) {
    this.ctx = el.getContext('2d');

    // init
    el.style.cursor = 'all-scroll';
    this.render();
    this.addEventListener();
  }

  render() {
    this.drawGrid();
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
   * 绘制网格
   */
  drawGrid() {
    const interval = this.options.gridSize;
    const { width, height } = this.options.size;
    const ctx = this.ctx;

    this.clear();
    this.resetTranslate();

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
