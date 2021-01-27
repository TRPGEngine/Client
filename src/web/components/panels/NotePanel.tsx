import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import type { CommonPanelProps } from '@shared/components/panel/type';
import { useAsync } from 'react-use';
import _isString from 'lodash/isString';
import _isNil from 'lodash/isNil';
import { fetchNoteInfo } from '@shared/model/note';
import { Result, Tooltip } from 'antd';
import LoadingSpinner from '../LoadingSpinner';
import { useTranslation } from '@shared/i18n';
import { Previewer } from '../editor/Previewer';
import { CommonPanel } from './CommonPanel';
import { Iconfont } from '../Iconfont';
import { Link } from 'react-router-dom';
import { useNoteInfo } from '@redux/hooks/note';

function useNoteEditBtn(noteUUID: string): React.ReactElement | null {
  const { t } = useTranslation();
  const noteInfo = useNoteInfo(noteUUID);

  if (_isNil(noteInfo)) {
    return null;
  }

  return (
    <Tooltip title={t('编辑')}>
      <Link style={{ color: 'inherit' }} to={`/main/personal/note/${noteUUID}`}>
        <Iconfont>&#xe602;</Iconfont>
      </Link>
    </Tooltip>
  );
}

/**
 * 团笔记面板
 */
export const NotePanel: React.FC<CommonPanelProps> = TMemo((props) => {
  const { panel } = props;
  const noteUUID = panel.target_uuid;
  const { t } = useTranslation();
  const noteEditBtn = useNoteEditBtn(noteUUID);

  const { loading, value, error } = useAsync(async () => {
    if (!_isString(noteUUID)) {
      return;
    }

    const note = await fetchNoteInfo(noteUUID);
    return note;
  }, [noteUUID]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!_isNil(value)) {
    return (
      <CommonPanel
        headerPrefix="#"
        header={panel.name}
        headerSuffix={noteEditBtn}
      >
        <div style={{ padding: 10 }}>
          <Previewer value={value.data as any} />
        </div>
      </CommonPanel>
    );
  }

  return (
    <Result status="error" title={t('笔记加载失败')} subTitle={String(error)} />
  );
});
NotePanel.displayName = 'NotePanel';
