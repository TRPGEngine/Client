import _clamp from 'lodash/clamp';
import _padStart from 'lodash/padStart';

/**
 * 将hex颜色根据不透明度转化为相应的半透明色彩
 * @param hexColor hex格式的颜色值
 * @param opacity 不透明度 该值越大啧约不可见 0位完全透明 1为完全不透明
 */
export function buildTransparentColorWithHex(
  hexColor: string,
  opacity: number
): string {
  opacity = _clamp(opacity, 0, 1);
  const opacityHex = _padStart(
    Number((opacity * 255).toFixed()).toString(16),
    2,
    '0'
  );
  return hexColor + opacityHex.toUpperCase();
}
