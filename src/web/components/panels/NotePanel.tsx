import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { CommonPanelProps } from '@shared/components/panel/type';
import { useAsync } from 'react-use';
import _isString from 'lodash/isString';
import _isNil from 'lodash/isNil';
import { fetchNoteInfo } from '@shared/model/note';
import { Result } from 'antd';
import LoadingSpinner from '../LoadingSpinner';
import { useTranslation } from '@shared/i18n';
import { Previewer } from '../editor/Previewer';
import { CommonPanel } from './CommonPanel';

/**
 * 团笔记面板
 */
export const NotePanel: React.FC<CommonPanelProps> = TMemo((props) => {
  const { panel } = props;
  const noteUUID = panel.target_uuid;
  const { t } = useTranslation();

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
      <CommonPanel headerPrefix="#" header={panel.name}>
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
