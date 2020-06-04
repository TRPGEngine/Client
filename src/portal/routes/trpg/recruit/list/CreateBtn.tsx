import React, { Fragment, useCallback, useState } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { Button, Modal } from 'antd';
import { LoginEnsureContainer } from '@portal/components/LoginEnsureContainer';

export const RecruitCreateBtn: React.FC = TMemo(() => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleCreateRecruit = useCallback(() => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setShowModal(false);
    }, 4000);
  }, [setLoading, setShowModal]);

  return (
    <Fragment>
      <Button type="primary" ghost={true} onClick={() => setShowModal(true)}>
        发布招募
      </Button>
      <Modal
        visible={showModal}
        confirmLoading={loading}
        onOk={handleCreateRecruit}
        onCancel={() => setShowModal(false)}
      >
        <LoginEnsureContainer>aaaa</LoginEnsureContainer>
      </Modal>
    </Fragment>
  );
});
RecruitCreateBtn.displayName = 'RecruitCreateBtn';
