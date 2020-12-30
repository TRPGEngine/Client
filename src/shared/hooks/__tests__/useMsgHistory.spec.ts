import { renderHook } from '@testing-library/react-hooks';
import { useMsgHistory } from '../useMsgHistory';

test('useMsgHistory', () => {
  const { result } = renderHook(() => useMsgHistory('any'));

  expect(result.current.switchDown()).toBe(null);
  expect(result.current.switchUp()).toBe(null);

  result.current.addHistoryMsg('msg1');
  result.current.addHistoryMsg('msg2');
  result.current.addHistoryMsg('msg3');

  expect(result.current.switchDown()).toBe('msg1');
  expect(result.current.switchDown()).toBe('msg2');
  expect(result.current.switchDown()).toBe('msg3');
  expect(result.current.switchDown()).toBe('msg1');
  expect(result.current.switchDown()).toBe('msg2');
  expect(result.current.switchDown()).toBe('msg3');

  expect(result.current.switchUp()).toBe('msg2');
  expect(result.current.switchUp()).toBe('msg1');
  expect(result.current.switchUp()).toBe('msg3');
  expect(result.current.switchUp()).toBe('msg2');
  expect(result.current.switchUp()).toBe('msg1');

  result.current.resetIndex();

  expect(result.current.switchUp()).toBe('msg3');
  expect(result.current.switchUp()).toBe('msg2');
  expect(result.current.switchUp()).toBe('msg1');
});
