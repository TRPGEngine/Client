import configureStore from '@redux/configureStore';

describe('redux action', () => {
  let store = null;

  beforeEach(() => {
    store = configureStore();
  });

  afterEach(() => {
    store = null;
  });

  it('store should be ok', () => {
    expect(store).not.toBeNull();
  });
});
