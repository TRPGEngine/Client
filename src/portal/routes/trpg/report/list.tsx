import React, { useCallback, useState, useEffect } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { ActionButton } from '@portal/components/ActionButton';
import history from '@portal/history';
import { fetchOwnReport } from '@portal/model/trpg';
import { ListItem } from '@portal/components/ListItem';
import { PortraitContainer } from '@portal/components/PortraitContainer';
import type { GameReport } from '@shared/model/trpg';

const TRPGReportList: React.FC = TMemo(() => {
  const [list, setList] = useState<GameReport[]>([]);

  useEffect(() => {
    fetchOwnReport().then(setList);
  }, []);

  const handleCreateReport = useCallback(() => {
    history.push('/trpg/report/create');
  }, []);

  const handlePreviewReport = useCallback((reportUUID) => {
    history.push(`/trpg/report/preview/${reportUUID}`);
  }, []);

  return (
    <PortraitContainer>
      <ActionButton onClick={handleCreateReport}>创建战报</ActionButton>
      {list.map((item) => (
        <ListItem
          key={item.uuid}
          onClick={() => handlePreviewReport(item.uuid)}
        >
          <div>
            <strong>{item.title}</strong>
          </div>
        </ListItem>
      ))}
    </PortraitContainer>
  );
});
TRPGReportList.displayName = 'TRPGReportList';

export default TRPGReportList;
