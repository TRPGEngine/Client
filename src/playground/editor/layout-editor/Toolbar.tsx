import { useAST } from '@saucerjs/core';
import { TMemo } from '@shared/components/TMemo';
import { Button, Input, Row, Modal, Space } from 'antd';
import React, { useCallback } from 'react';
import { serializeToXML } from '@saucerjs/xml';
import { Previewer } from './Previewer';

export const Toolbar: React.FC = TMemo(() => {
  const ast = useAST();

  const handlePreview = useCallback(() => {
    const innerXML = serializeToXML(ast);
    const xml = `<?xml version="1.0" encoding="utf-8" ?><Template>${innerXML}</Template>`;

    Modal.info({
      content: <Previewer xml={xml} />,
      icon: null,
    });
  }, [ast]);

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
      <Space>
        <Button type="primary" onClick={handlePreview}>
          预览
        </Button>

        <Button type="primary" onClick={handleExportXML}>
          输出配置
        </Button>
      </Space>
    </Row>
  );
});
Toolbar.displayName = 'Toolbar';
