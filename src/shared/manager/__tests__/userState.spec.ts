describe('userState', () => {
  let subscribeToUserLoginSuccess: (cb: () => void) => void;
  let callUserLoginSuccess: () => void;
  beforeEach(async () => {
    jest.resetModules();

    const module = await import('../userState');
    subscribeToUserLoginSuccess = module.subscribeToUserLoginSuccess;
    callUserLoginSuccess = module.callUserLoginSuccess;
  });

  test('normal call', () => {
    const fn = jest.fn();
    subscribeToUserLoginSuccess(fn);
    callUserLoginSuccess();

    expect(fn.mock.calls.length).toBe(1);
  });

  test('subscribe twice', () => {
    const fn = jest.fn();
    subscribeToUserLoginSuccess(fn);
    subscribeToUserLoginSuccess(fn);
    callUserLoginSuccess();

    expect(fn.mock.calls.length).toBe(2);
  });

  test('subscribe with two fn', () => {
    const fn1 = jest.fn();
    const fn2 = jest.fn();
    subscribeToUserLoginSuccess(fn1);
    subscribeToUserLoginSuccess(fn2);
    callUserLoginSuccess();

    expect(fn1.mock.calls.length).toBe(1);
    expect(fn2.mock.calls.length).toBe(1);
  });

  test('subscribe after login', () => {
    const fn = jest.fn();
    callUserLoginSuccess();
    subscribeToUserLoginSuccess(fn);

    expect(fn.mock.calls.length).toBe(1);
  });
});
