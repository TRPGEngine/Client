import { useAST } from '@saucerjs/core';
import { TMemo } from '@shared/components/TMemo';
import { Button, Input, Row, Modal } from 'antd';
import React, { useCallback } from 'react';
import { serializeToXML } from '@saucerjs/xml';

export const Toolbar: React.FC = TMemo(() => {
  const ast = useAST();

  const handleExportXML = useCallback(() => {
    const innerXML = serializeToXML(ast);
    const xml = `<?xml version="1.0" encoding="utf-8" ?><Template>${innerXML}</Template>`;

    Modal.info({
      content: <Input.TextArea value={xml} autoSize={true} />,
      icon: null,
    });
  }, [ast]);

  return (
    <Row justify="end" style={{ padding: '4px 8px' }}>
      <Button type="primary" onClick={handleExportXML}>
        输出配置
      </Button>
    </Row>
  );
});
Toolbar.displayName = 'Toolbar';
