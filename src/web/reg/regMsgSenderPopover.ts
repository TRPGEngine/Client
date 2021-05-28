import type { RenderMsgPayload } from '@redux/types/chat';
import { buildRegList } from '@shared/manager/buildRegList';

interface MsgSenderPopoverItem {
  match: (msgPayload: RenderMsgPayload) => boolean;
  render: (msgPayload: RenderMsgPayload) => React.ReactElement;
}
export const [msgSenderPopoverList, regMsgSenderPopover] =
  buildRegList<MsgSenderPopoverItem>();
