import { Position, Size } from '../core/types';
import { DrawContext } from '../core/render';
import _isNumber from 'lodash/isNumber';

export class Token {
  position: Position = { x: 0, y: 0 };

  constructor(public name: string) {}

  /**
   * 准备
   * 当外层增加token时会检查token是否准备完毕
   */
  async prepare(): Promise<void> {}

  draw(ctx: DrawContext) {
    throw new Error('Should be Implement');
  }
}

export class ImageToken extends Token {
  size: Size;
  private _image: HTMLImageElement;
  private _promise: Promise<HTMLImageElement>;
  loaded: boolean = false;

  constructor(name: string, public imageSrc: string) {
    super(name);

    this._promise = new Promise((resolve, reject) => {
      const image = new Image();
      image.src = imageSrc;
      image.onload = () => {
        this.size = {
          width: _isNumber(image.width) ? image.width : 100,
          height: _isNumber(image.height) ? image.height : 100,
        };
        this.loaded = true;

        resolve(image);
      };
      image.onerror = () => {
        console.error('[ImageToken]', '加载失败:', this.imageSrc);

        reject();
      };
      this._image = image;
    });
  }

  get promise() {
    return this._promise;
  }

  async prepare(): Promise<void> {
    await Promise.resolve(this._promise);
  }

  draw(ctx: DrawContext) {
    if (!this.loaded) {
      return;
    }

    ctx.render.canvas.drawImage(
      this._image,
      this.position.x,
      this.position.y,
      this.size.width,
      this.size.height
    );
  }
}
