import React, { useState, useCallback, useMemo } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import _isFunction from 'lodash/Function';
import { Space, InputNumber, Button, Popover } from 'antd';

/**
 * 通用增加棋子操作
 */
export const AppendTokenAction: React.FC<{
  content?: React.ReactNode;
  onConfirm: (x: number, y: number) => void;
}> = React.memo((props) => {
  const [visible, setVisible] = useState(false);
  const [x, setX] = useState(1);
  const [y, setY] = useState(1);

  const handleConfirm = useCallback(() => {
    _isFunction(props.onConfirm) && props.onConfirm(x - 1, y - 1);
    setVisible(false);
  }, [x, y, props.onConfirm, setVisible]);

  const width = 20;
  const height = 20;

  const content = useMemo(() => {
    return (
      <div>
        <Space direction="vertical">
          <div>
            <InputNumber
              value={x}
              onChange={(val) => setX(Number(val))}
              min={1}
              max={width + 1}
              precision={0}
            />
            <span style={{ margin: 4 }}>x</span>
            <InputNumber
              value={y}
              onChange={(val) => setY(Number(val))}
              min={1}
              max={height + 1}
              precision={0}
            />
          </div>
          <div>{props.content}</div>
          <div>
            <Button type="link" onClick={handleConfirm}>
              确认
            </Button>
          </div>
        </Space>
      </div>
    );
  }, [x, y, setX, setY, handleConfirm, props.content]);

  return (
    <Popover
      placement="left"
      title="添加到地图"
      content={content}
      trigger="click"
      visible={visible}
      onVisibleChange={setVisible}
    >
      <Button shape="circle" icon={<PlusOutlined />} />
    </Popover>
  );
});
