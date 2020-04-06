import { TiledMapManager } from '../manager';

const defaultOpts = {
  size: {
    width: 20,
    height: 15,
  },
  gridSize: {
    width: 40,
    height: 40,
  },
};

describe('TiledMapManager', () => {
  test('constructor', () => {
    const el = document.createElement('canvas');
    const manager = new TiledMapManager(el, defaultOpts);

    expect(manager).toBeTruthy();
  });
});
