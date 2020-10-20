import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchActorDetail, fetchTemplateInfo } from '@portal/model/actor';
import Loading from './Loading';
import XMLBuilder, {
  XMLBuilderState,
  DataMap,
} from '@shared/components/layout/XMLBuilder';
import _isFunction from 'lodash/isFunction';
import { fetchGroupActorDetail } from '@shared/model/group';

interface Props {
  uuid: string; // 角色UUID或团角色UUID
  type: 'detail' | 'edit';
  onChange?: (data: DataMap) => void;
  isGroupActor?: boolean; // 是否为团角色
}
const ActorEditor: React.FC<Props> = (props) => {
  const [actorInfo, setActorInfo] = useState({});
  const [templateLayout, setTemplateLayout] = useState('');

  // 修改角色数据
  const changeActorData = useCallback((data: DataMap) => {
    setActorInfo(data);
    _isFunction(props.onChange) && props.onChange(data);
  }, []);

  useEffect(() => {
    (async () => {
      if (props.isGroupActor === true) {
        // 是团角色
        const groupActor = await fetchGroupActorDetail(props.uuid);
        const template = await fetchTemplateInfo(
          groupActor.actor_template_uuid
        );

        changeActorData(groupActor.actor_info);
        setTemplateLayout(template?.layout ?? '');
      } else {
        // 是普通角色
        const actor = await fetchActorDetail(props.uuid);
        const template = await fetchTemplateInfo(actor.template_uuid);

        changeActorData(actor.info);
        setTemplateLayout(template?.layout ?? '');
      }
    })();
  }, []);

  return useMemo(() => {
    if (templateLayout === '') {
      return <Loading />;
    }

    const handleChange = (info: XMLBuilderState) => {
      changeActorData(info.data);
    };

    return (
      <div>
        <XMLBuilder
          xml={templateLayout}
          layoutType={props.type}
          initialData={actorInfo}
          onChange={handleChange}
        />
        {props.children}
      </div>
    );
  }, [templateLayout, actorInfo]);
};
ActorEditor.displayName = 'ActorEditor';
ActorEditor.defaultProps = {
  isGroupActor: false,
};

export default ActorEditor;
