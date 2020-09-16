import { getFeedbackUrl, getDSN, getLastEventId } from '@web/utils/sentry';
import _isNil from 'lodash/isNil';
import axios from 'axios';

/**
 * NOTE: 注意: 这个依赖于web端的一些设置
 * 需要进行进一步抽象RN端才能正常使用
 */

/**
 * 向sentry发送用户反馈
 */
interface UserFeedbackParams {
  name: string;
  email: string;
  comments: string;
}
export async function sendUserFeedback(
  params: UserFeedbackParams
): Promise<void> {
  const feedbackUrl = getFeedbackUrl();
  if (_isNil(feedbackUrl)) {
    return;
  }

  await axios.post(
    feedbackUrl,
    { event_id: getLastEventId() ?? 'empty', ...params },
    {
      headers: {
        Authorization: `DSN ${getDSN()}`,
      },
    }
  );
}
