import React, { useCallback, useMemo } from 'react';
import ModalPanel from '@web/components/ModalPanel';
import { TMemo } from '@shared/components/TMemo';
import { useTRPGDispatch } from '@redux/hooks/useTRPGSelector';
import { useCachedActorTemplateInfo } from '@redux/hooks/useCache';
import _get from 'lodash/get';
import _isString from 'lodash/isString';
import XMLBuilder from '@shared/components/layout/XMLBuilder';
import { Iconfont } from '@web/components/Iconfont';
import {
  requestAgreeGroupActor,
  requestRefuseGroupActor,
} from '@shared/model/group';
import { closeModal } from '@web/components/Modal';
import { showToasts } from '@shared/manager/ui';
import { agreeGroupActor, refuseGroupActor } from '@redux/actions/group';
import { hideModal } from '@redux/actions/ui';

import './GroupActorCheck.scss';

interface Props {
  actorData: {};
  templateUUID: string;
  groupUUID: string;
  groupActorUUID: string;
}
export const GroupActorCheck: React.FC<Props> = TMemo((props) => {
  // TODO: 也许需要做成可以由管理员进行修改的方式

  // const [editingData, setEditingData] = useState(props.actorData);
  const dispatch = useTRPGDispatch();

  const handleAgree = useCallback(() => {
    requestAgreeGroupActor(props.groupUUID, props.groupActorUUID)
      .then((groupActor) => {
        dispatch(
          agreeGroupActor({
            groupUUID: props.groupUUID,
            groupActor,
          })
        );
        showToasts('已同意该人物加入本团!');
        dispatch(hideModal()); // TODO: 这是兼容老UI
        closeModal();
      })
      .catch((err) => {
        showToasts(err, 'error');
        console.error(err);
      });
  }, [props.groupUUID, props.groupActorUUID]);

  const handleRefuse = useCallback(() => {
    requestRefuseGroupActor(props.groupUUID, props.groupActorUUID)
      .then(() => {
        dispatch(
          refuseGroupActor({
            groupUUID: props.groupUUID,
            groupActorUUID: props.groupActorUUID,
          })
        );
        showToasts('已拒绝该人物加入本团!');
        dispatch(hideModal()); // TODO: 这是兼容老UI
        closeModal();
      })
      .catch((err) => {
        showToasts(err, 'error');
        console.error(err);
      });
  }, [props.groupUUID, props.groupActorUUID]);

  const template = useCachedActorTemplateInfo(props.templateUUID);
  const layout = _get(template, 'layout');

  const actions = useMemo(() => {
    return (
      <div className="actions">
        <button onClick={handleRefuse}>
          <Iconfont>&#xe680;</Iconfont>拒绝
        </button>
        <button onClick={handleAgree}>
          <Iconfont>&#xe66b;</Iconfont>通过
        </button>
      </div>
    );
  }, [handleRefuse, handleAgree]);

  return useMemo(
    () => (
      <ModalPanel
        className="group-actor-check"
        title="审核人物"
        actions={actions}
        allowMaximize={true}
      >
        {_isString(layout) ? (
          <XMLBuilder
            xml={layout}
            initialData={props.actorData}
            layoutType="detail"
            // layoutType="edit"
            // onChange={(newState) => setEditingData(newState.data)}
          />
        ) : (
          <div>数据获取失败...</div>
        )}
      </ModalPanel>
    ),
    [layout, actions, props.actorData]
  );
});
GroupActorCheck.displayName = 'GroupActorCheck';
