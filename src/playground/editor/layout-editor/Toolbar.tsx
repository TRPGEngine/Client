import { useAST } from '@saucerjs/core';
import { TMemo } from '@shared/components/TMemo';
import { Button, Input, Row, Modal, Space } from 'antd';
import React, { useCallback } from 'react';
import { serializeToXML } from '@saucerjs/xml';
import { Previewer } from './Previewer';
import { useHistory } from 'react-router';
import { CODE_STORE_KEY } from '../../helper';

export const Toolbar: React.FC = TMemo(() => {
  const ast = useAST();
  const history = useHistory();

  const handleSwitchToAdvanced = useCallback(() => {
    const { destroy } = Modal.confirm({
      title: '确认要切换到进阶编辑器么',
      content:
        '切换后无法返回到可视化编辑器, 因为进阶编辑器拥有更加强大的自定义能力。',
      onOk() {
        const innerXML = serializeToXML(ast);
        const xml = `<?xml version="1.0" encoding="utf-8" ?><Template>${innerXML}</Template>`;

        localStorage.setItem(CODE_STORE_KEY, xml);

        destroy();
        history.push('/layout/advanced');
      },
    });
  }, [ast, history]);

  const handlePreview = useCallback(() => {
    const innerXML = serializeToXML(ast);
    const xml = `<?xml version="1.0" encoding="utf-8" ?><Template>${innerXML}</Template>`;

    Modal.info({
      content: <Previewer xml={xml} />,
      icon: null,
    });
  }, [ast]);

  const handleExportXML = useCallback(() => {
    console.log('ast', ast);
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
        <Button onClick={handleSwitchToAdvanced}>切换到进阶编辑器</Button>

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
