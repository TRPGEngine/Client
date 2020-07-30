import { MsgDataManager } from '../msg-helper';

describe('MsgDataManager', () => {
  test('toJS should be ok', () => {
    const msgDataManager = new MsgDataManager();
    msgDataManager.name = 'any';

    expect(msgDataManager.toJS()).toMatchObject({
      name: 'any',
    });
  });

  test('parseData should be ok', () => {
    const msgDataManager = new MsgDataManager();
    msgDataManager.parseData({
      name: 'any',
    });

    expect(msgDataManager.toJS()).toMatchObject({
      name: 'any',
    });
  });

  test('setGroupActorInfo should be ok', () => {
    const msgDataManager = new MsgDataManager();

    msgDataManager.setGroupActorInfo({
      uuid: 'uuid',
      name: 'name',
      desc: 'desc',
      avatar: 'avatar',
      passed: true,
      enabled: true,
      actor_uuid: '',
      actor: null as any,
    });

    expect(msgDataManager.toJS()).toMatchObject({
      name: 'name',
      avatar: 'avatar',
      groupActorUUID: 'uuid',
    });
  });
});
