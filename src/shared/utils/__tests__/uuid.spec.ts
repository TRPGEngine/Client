import { isLocalMsgUUID, isUserOrGroupUUID, isUserUUID, isUUID } from '../uuid';

describe('uuid', () => {
  const uuidv1 = '7b190420-057d-11eb-aaac-519b28044e54';
  const uuidv4 = '43f564e9-cc29-4e9c-b01c-01157190435a';

  test('isUserUUID', () => {
    expect(isUUID(uuidv1)).toBe(true);
    expect(isUUID(uuidv4)).toBe(true);
  });

  test('isUserUUID', () => {
    expect(isUserUUID(uuidv1)).toBe(true);
    expect(isUserUUID(uuidv4)).toBe(false);
  });

  test('isUserOrGroupUUID', () => {
    expect(isUserOrGroupUUID(uuidv1)).toBe(true);
    expect(isUserOrGroupUUID(uuidv4)).toBe(false);
  });

  test('isLocalMsgUUID', () => {
    expect(isLocalMsgUUID('local#6')).toBe(true);
    expect(isLocalMsgUUID('1')).toBe(false);
    expect(isLocalMsgUUID(uuidv4)).toBe(false);
  });
});
