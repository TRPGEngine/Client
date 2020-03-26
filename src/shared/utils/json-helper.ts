// [{a: 1, b: 2}] => [1, "a", "b", 1, 2]
import _chunk from 'lodash/chunk';
import _zipObject from 'lodash/zipObject';

/**
 * 压缩列表
 */
export function hpack(list: any[]): any[] {
  const keys = Object.keys(list[0] ?? {});
  const size = keys.length;

  const data = [size, ...keys];

  for (const item of list) {
    for (const key of keys) {
      data.push(item[key] ?? null);
    }
  }

  return data;
}

/**
 * 解压缩
 */
export function hunpack(list: any[]): any[] {
  const _list = [...list];
  const size = _list.shift();

  const [keys, ...datas] = _chunk(_list, size);

  const ret = datas.map((d) => _zipObject(keys, d));

  return ret;
}
