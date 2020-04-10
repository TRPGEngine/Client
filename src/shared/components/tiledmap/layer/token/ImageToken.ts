import _isNumber from 'lodash/isNumber';
import { Size, TokenData } from '../../core/types';
import { DrawContext } from '../../core/render';
import { BaseToken } from './BaseToken';

export function loadImageP(imageUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageUrl;
    image.onload = () => {
      resolve(image);
    };
    image.onerror = () => {
      console.error('[ImageToken]', '图片加载失败:', imageUrl);

      reject();
    };
  });
}

export class ImageToken extends BaseToken {
  static TYPE = 'ImageToken';

  imageSize: Size; // 图片的实际大小
  private _image: HTMLImageElement;
  private _promise: Promise<HTMLImageElement>;
  loaded: boolean = false;

  constructor(public imageSrc: string, id?: string) {
    super(id);

    this._promise = loadImageP(imageSrc).then((image) => {
      this.imageSize = {
        width: _isNumber(image.width) ? image.width : 100,
        height: _isNumber(image.height) ? image.height : 100,
      };
      this.loaded = true;
      this._image = image;

      return image;
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

    const { gridSize } = ctx;

    ctx.render.canvas.drawImage(
      this._image,
      this.gridPosition.x * gridSize.width,
      this.gridPosition.y * gridSize.height,
      this.gridAreaSize.width * gridSize.width,
      this.gridAreaSize.height * gridSize.height
    );
  }

  getData(): TokenData {
    return {
      ...super.getData(),
      _type: ImageToken.TYPE,
      imageSize: this.imageSize,
      imageSrc: this.imageSrc,
    };
  }

  parseData(data: TokenData) {
    super.parseData(data);
    this.imageSize = data.imageSize;
    this.imageSrc = data.imageSrc;
  }
}
