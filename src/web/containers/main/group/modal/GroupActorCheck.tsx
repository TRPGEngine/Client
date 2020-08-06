import React, { useState, useCallback, useMemo } from 'react';
import { connect } from 'react-redux';
import ModalPanel from '@web/components/ModalPanel';
import ActorProfile from '@web/components/modal/ActorProfile';
import {
  agreeGroupActor,
  refuseGroupActor,
  requestUpdateGroupActorInfo,
} from '@shared/redux/actions/group';
import { TRPGDispatch, TRPGState } from '@redux/types/__all__';
import { TMemo } from '@shared/components/TMemo';
import { useTRPGDispatch } from '@shared/hooks/useTRPGSelector';
import { useCachedActorTemplateInfo } from '@shared/hooks/useCache';
import _get from 'lodash/get';
import _isString from 'lodash/isString';

import './GroupActorCheck.scss';
import XMLBuilder from '@shared/components/layout/XMLBuilder';

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
    dispatch(agreeGroupActor(props.groupUUID, props.groupActorUUID));
  }, [dispatch, props.groupUUID, props.groupActorUUID]);

  const handleRefuse = useCallback(() => {
    dispatch(refuseGroupActor(props.groupUUID, props.groupActorUUID));
  }, [dispatch, props.groupUUID, props.groupActorUUID]);

  const template = useCachedActorTemplateInfo(props.templateUUID);
  const layout = _get(template, 'layout');

  const actions = useMemo(() => {
    return (
      <div className="actions">
        <button onClick={handleRefuse}>
          <i className="iconfont">&#xe680;</i>拒绝
        </button>
        <button onClick={handleAgree}>
          <i className="iconfont">&#xe66b;</i>通过
        </button>
      </div>
    );
  }, [handleRefuse, handleAgree]);

  return useMemo(
    () =>
      _isString(layout) ? (
        <ModalPanel
          className="group-actor-check"
          title="审核人物"
          actions={actions}
          allowMaximize={true}
        >
          <XMLBuilder
            xml={layout}
            initialData={props.actorData}
            layoutType="detail"
            // layoutType="edit"
            // onChange={(newState) => setEditingData(newState.data)}
          />
        </ModalPanel>
      ) : null,
    [layout, actions, props.actorData]
  );
});
GroupActorCheck.displayName = 'GroupActorCheck';
