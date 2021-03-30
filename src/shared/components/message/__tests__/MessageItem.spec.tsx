/* eslint-disable @typescript-eslint/tslint/config */
/* eslint-disable react/jsx-key */

import { buildMsgPayload } from '@shared/utils/data-helper';
import { TestFullProvider } from '@test/utils';
import { render } from '@testing-library/react';
import React from 'react';
import { MessageItem } from '../MessageItem';
import '@web/components/messageTypes/__all__';
import mockdate from 'mockdate';

describe('MessageItem', () => {
  const name = 'Tester';
  const sender_uuid = 'uuid#0';
  const message = 'Any Message';

  mockdate.set('2021-03-30 12:00:00');

  afterAll(() => {
    mockdate.reset();
  });

  test.each([
    [
      <MessageItem
        data={buildMsgPayload({
          sender_uuid,
          message,
          data: {
            name,
          },
        })}
        emphasizeTime={true}
      />,
    ],
    [
      <MessageItem
        data={buildMsgPayload({
          sender_uuid,
          message,
        })}
        emphasizeTime={false}
      />,
    ],
    [
      <MessageItem
        data={buildMsgPayload({
          sender_uuid: 'trpgbot',
          message,
          data: {
            name,
          },
        })}
        emphasizeTime={false}
        omitSenderInfo={true}
      />,
    ],
    [
      <MessageItem
        data={buildMsgPayload({
          sender_uuid,
          message,
          data: {
            name,
          },
        })}
        emphasizeTime={false}
        omitSenderInfo={false}
      />,
    ],
  ])('testcase %#', (el) => {
    // console.log('date', moment().valueOf());
    const wrapper = render(el, { wrapper: TestFullProvider });
    expect(wrapper.container).toMatchSnapshot();
  });
});
