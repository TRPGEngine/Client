import configureStore from '@src/shared/redux/configureStore';

describe('redux basic', () => {
  it('configureStore should be ok', () => {
    const store = configureStore();
    expect(store).not.toBeNull();
  });
});
