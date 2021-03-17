import * as trpgApi from '@shared/api/trpg.api';
import { setConverseAckWithMsgTime } from '../event';
import uuid from 'uuid/v1';
const api = trpgApi.getInstance();

describe('setConverseAckWithMsgTime', () => {
  const emitFn = api.emitP as jest.Mock;

  test('emit message', async () => {
    emitFn.mockClear();

    const converseUUID = uuid();

    await setConverseAckWithMsgTime(converseUUID, 'message1', 1);

    expect(emitFn.mock.calls.length).toBe(1);
    expect(emitFn.mock.calls[0][1]).toEqual({
      converseUUID,
      lastLogUUID: 'message1',
    });
  });

  test('emit message twice', async () => {
    emitFn.mockClear();

    const converseUUID = uuid();

    await setConverseAckWithMsgTime(converseUUID, 'message1', 1);
    await setConverseAckWithMsgTime(converseUUID, 'message2', 2);

    expect(emitFn.mock.calls.length).toBe(2);
    expect(emitFn.mock.calls[0][1]).toEqual({
      converseUUID,
      lastLogUUID: 'message1',
    });
    expect(emitFn.mock.calls[1][1]).toEqual({
      converseUUID,
      lastLogUUID: 'message2',
    });
  });

  test('emit message twice but older', async () => {
    emitFn.mockClear();

    const converseUUID = uuid();

    await setConverseAckWithMsgTime(converseUUID, 'message2', 2);
    await setConverseAckWithMsgTime(converseUUID, 'message1', 1);

    expect(emitFn.mock.calls.length).toBe(1);
    expect(emitFn.mock.calls[0][1]).toEqual({
      converseUUID,
      lastLogUUID: 'message2',
    });
  });

  test('emit message twice but equal', async () => {
    emitFn.mockClear();

    const converseUUID = uuid();

    await setConverseAckWithMsgTime(converseUUID, 'message1', 1);
    await setConverseAckWithMsgTime(converseUUID, 'message2', 1);

    expect(emitFn.mock.calls.length).toBe(1);
    expect(emitFn.mock.calls[0][1]).toEqual({
      converseUUID,
      lastLogUUID: 'message1',
    });
  });

  test('emit message twice older but not same converse', async () => {
    emitFn.mockClear();

    const converseUUID1 = uuid();
    const converseUUID2 = uuid();

    await setConverseAckWithMsgTime(converseUUID2, 'message2', 2);
    await setConverseAckWithMsgTime(converseUUID1, 'message1', 1);

    expect(emitFn.mock.calls.length).toBe(2);
    expect(emitFn.mock.calls[0][1]).toEqual({
      converseUUID: converseUUID2,
      lastLogUUID: 'message2',
    });
    expect(emitFn.mock.calls[1][1]).toEqual({
      converseUUID: converseUUID1,
      lastLogUUID: 'message1',
    });
  });
});
