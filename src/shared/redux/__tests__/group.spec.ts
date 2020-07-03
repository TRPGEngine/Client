import { buildTestStore } from './utils';
import { removeGroup, removeGroupMember } from '@redux/actions/group';
import constants from '../constants';
import { testUserInfo } from './example/user';
const {
  REMOVE_GROUP_MEMBER,
  REMOVE_CONVERSES_SUCCESS,
  QUIT_GROUP_SUCCESS,
} = constants;

describe('group action', () => {
  test('removeGroup', () => {
    const { store, actionTrigger } = buildTestStore();
    const groupUUID = 'testuuid';
    store.dispatch(removeGroup(groupUUID));

    expect(actionTrigger).toBeCalledTimes(2);
    expect(actionTrigger.mock.calls[0][0]).toBe(QUIT_GROUP_SUCCESS);
    expect(actionTrigger.mock.calls[1][0]).toBe(REMOVE_CONVERSES_SUCCESS);
    expect(actionTrigger.mock.calls[0][1]).toMatchObject({
      type: QUIT_GROUP_SUCCESS,
      groupUUID,
    });
    expect(actionTrigger.mock.calls[1][1]).toMatchObject({
      type: REMOVE_CONVERSES_SUCCESS,
      converseUUID: groupUUID,
    });
  });

  describe('removeGroupMember', () => {
    test('target is self', () => {
      const { store, actionTrigger } = buildTestStore();
      const groupUUID = 'testuuid';
      const memberUUID = testUserInfo.uuid;
      store.dispatch(removeGroupMember(groupUUID, memberUUID));

      expect(actionTrigger).toBeCalledTimes(2);
      expect(actionTrigger.mock.calls[0][0]).toBe(QUIT_GROUP_SUCCESS);
      expect(actionTrigger.mock.calls[1][0]).toBe(REMOVE_CONVERSES_SUCCESS);
      expect(actionTrigger.mock.calls[0][1]).toMatchObject({
        type: QUIT_GROUP_SUCCESS,
        groupUUID,
      });
      expect(actionTrigger.mock.calls[1][1]).toMatchObject({
        type: REMOVE_CONVERSES_SUCCESS,
        converseUUID: groupUUID,
      });
    });

    test('target is not self', () => {
      const { store, actionTrigger } = buildTestStore();
      const groupUUID = 'testuuid';
      const memberUUID = 'any others';
      store.dispatch(removeGroupMember(groupUUID, memberUUID));

      expect(actionTrigger).toBeCalledTimes(1);
      expect(actionTrigger.mock.calls[0][0]).toBe(REMOVE_GROUP_MEMBER);
      expect(actionTrigger.mock.calls[0][1]).toMatchObject({
        type: REMOVE_GROUP_MEMBER,
        groupUUID,
        memberUUID,
      });
    });
  });
});
