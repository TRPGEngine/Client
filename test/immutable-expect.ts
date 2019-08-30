import immutable from 'immutable';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeImmutable(): R;
      toBeImmutableMap(): R;
      toBeImmutableList(): R;
    }
  }
}

expect.extend({
  /**
   * 判断是否为不可变变量
   */
  toBeImmutable(received) {
    // const pass = received >= floor && received <= ceiling;
    const pass = immutable.isImmutable(received);
    if (pass) {
      return {
        message: () => `expected ${received} not to be immutable`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be immutable`,
        pass: false,
      };
    }
  },
  /**
   * 判断是否为不可变对象
   */
  toBeImmutableMap(received) {
    const pass = immutable.isMap(received);
    if (pass) {
      return {
        message: () => `expected ${received} not to be immutable map`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be immutable map`,
        pass: false,
      };
    }
  },
  /**
   * 判断是否为不可变列表
   */
  toBeImmutableList(received) {
    const pass = immutable.isList(received);
    if (pass) {
      return {
        message: () => `expected ${received} not to be immutable list`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be immutable list`,
        pass: false,
      };
    }
  },
});
