import React, { useState, useCallback, useMemo } from 'react';
import ModalPanel from '@web/components/ModalPanel';
import TRPGEditor from '@shared/editor';
import { Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { TRPGState } from '@redux/types/__all__';
import { requestUpdateGroupInfo } from '@redux/actions/group';
import { GroupInfo } from '@redux/types/group';
import { useTRPGSelector } from '@redux/hooks/useTRPGSelector';

interface Props {}
const GroupRuleEditor: React.FC<Props> = React.memo((props) => {
  const [content, setContent] = useState('');
  const dispatch = useDispatch();
  const groupInfo = useTRPGSelector((state) => {
    const selectedGroupUUID = state.group.selectedGroupUUID;
    return state.group.groups.find((group) => group.uuid === selectedGroupUUID);
  });
  const groupUUID = useMemo(() => {
    return groupInfo && groupInfo.uuid;
  }, [groupInfo]);

  const handleSave = useCallback(() => {
    dispatch(
      requestUpdateGroupInfo(groupUUID!, {
        rule: content,
      })
    );
  }, [content]);

  return (
    <ModalPanel
      title="编辑团规"
      style={{ height: 520, width: 680 }}
      padding={0}
      actions={<Button onClick={handleSave}>保存</Button>}
    >
      <TRPGEditor defaultValue={groupInfo?.rule} onChange={setContent} />
    </ModalPanel>
  );
});

export default GroupRuleEditor;
