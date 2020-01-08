import { request } from '@portal/utils/request';

/**
 * 获取帮助FAQ
 */
export interface HelpFAQItem {
  q: string;
  a: string;
}
export async function getHelpFAQ(): Promise<HelpFAQItem[]> {
  const { data } = await request.get('/help/feedback/faq');

  if (data.result === true) {
    return data.list;
  } else {
    throw new Error(data.msg);
  }
}

interface FeedbackPayload {
  username: string;
  contact: string;
  content: string;
}
export async function sendFeedback(payload: FeedbackPayload): Promise<void> {
  const { data } = await request.post('/help/feedback/submit', payload);
  if (data.result === false) {
    throw new Error(data.msg);
  }
}
