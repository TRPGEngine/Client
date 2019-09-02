import configureStore from '@src/redux/configureStore';

describe('redux basic', () => {
  it('configureStore should be ok', () => {
    const store = configureStore();
    expect(store).not.toBeNull();
  });
});
