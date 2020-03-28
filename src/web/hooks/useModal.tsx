import React, { useMemo, useState, useCallback } from 'react';
import { Modal } from 'antd';
import _isFunction from 'lodash/isFunction';

/**
 * 快速创建一个antd的模态框的节点
 * @param title 模态框标题
 * @param body 模态框内容
 * @param onOk 确认按钮回调
 */
export function useModal(
  title: string,
  body: React.ReactNode,
  onOk?: () => void
) {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const showModal = useCallback(() => {
    setVisible(true);
  }, [setVisible]);

  const handleOk = useCallback(async () => {
    _isFunction(onOk) && (await onOk());
    setVisible(false);
  }, [onOk, setVisible]);

  const handleCancel = useCallback(async () => {
    setVisible(false);
  }, []);

  const modal = useMemo(
    () => (
      <Modal
        title={title}
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{ loading }}
      >
        {body}
      </Modal>
    ),
    [title, body, visible, handleOk, handleCancel]
  );

  return { modal, showModal, setLoading };
}
