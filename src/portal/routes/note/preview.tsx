import Loading from '@portal/components/Loading';
import { TMemo } from '@shared/components/TMemo';
import { fetchNoteInfo } from '@shared/model/note';
import { Previewer } from '@web/components/editor/Previewer';
import { Alert, Divider, Typography } from 'antd';
import React from 'react';
import type { RouteComponentProps } from 'react-router';
import { useAsync } from 'react-use';
import _isNil from 'lodash/isNil';
import styled from 'styled-components';

const Root = styled.div`
  padding: 10px;
`;

interface Props
  extends RouteComponentProps<{
    noteUUID: string;
  }> {}
const NotePreview: React.FC<Props> = TMemo((props) => {
  const noteUUID = props.match.params.noteUUID;
  const { loading, value: noteInfo, error } = useAsync(async () => {
    const noteInfo = await fetchNoteInfo(noteUUID);

    return noteInfo;
  }, [noteUUID]);

  if (loading) {
    return <Loading />;
  }

  if (!noteInfo || !_isNil(error)) {
    return <Alert message="笔记数据获取异常" type="warning" />;
  }

  return (
    <Root>
      <Typography.Title level={2}>
        {noteInfo.title ?? '&nbsp;'}
      </Typography.Title>
      <Divider />
      <Previewer nodes={noteInfo.data} />
    </Root>
  );
});
NotePreview.displayName = 'NotePreview';

export default NotePreview;
