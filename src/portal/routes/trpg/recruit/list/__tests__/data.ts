import uuid from 'uuid/v1';
import { lorem } from '@test/lorem';
import { getRandomItem } from '@shared/utils/array-helper';
import { RecruitItemType } from '@portal/model/trpg';
import moment from 'moment';

/**
 * 用于显示瀑布流列表的测试数据
 */

const testRecuitList = Array(10)
  .fill({})
  .map<RecruitItemType>(() => ({
    uuid: uuid(),
    title: lorem.generateWords(),
    author: lorem.generateWords(8),
    content: lorem.generateParagraphs(4),
    platform: getRandomItem(['trpgengine', 'qq', 'other']),
    contact_type: getRandomItem(['user', 'group']),
    contact_content: lorem.generateWords(6),
    updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    completed: false,
  }));
export default testRecuitList;
