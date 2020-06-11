import React, { Fragment, useState } from 'react';
import { Button, Modal } from 'antd';
import { TMemo } from '@shared/components/TMemo';
import { LoginEnsureContainer } from '@portal/components/LoginEnsureContainer';
import { MyRecruitList } from './MyRecruitList';

export const MyBtn: React.FC<{
  onUpdate?: () => void;
}> = TMemo((props) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <Fragment>
      <Button type="link" onClick={() => setShowModal(true)}>
        我的招募
      </Button>

      <Modal
        visible={showModal}
        destroyOnClose={true}
        onCancel={() => setShowModal(false)}
        footer={null}
      >
        <LoginEnsureContainer>
          <MyRecruitList onUpdate={props.onUpdate} />
        </LoginEnsureContainer>
      </Modal>
    </Fragment>
  );
});
MyBtn.displayName = 'MyBtn';
