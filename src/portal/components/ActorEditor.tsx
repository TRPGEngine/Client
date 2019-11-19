import React, { useState, useEffect, useMemo, PropsWithChildren } from 'react';
import { fetchActorDetail, fetchTemplateInfo } from '@portal/model/actor';
import Loading from './Loading';
import XMLBuilder, {
  XMLBuilderState,
  DataMap,
} from '@shared/layout/XMLBuilder';
import _isFunction from 'lodash/isFunction';

interface Props {
  actorUUID: string;
  type: 'detail' | 'edit';
  onChange?: (data: DataMap) => void;
}
const ActorEditor = (props: PropsWithChildren<Props>) => {
  const [actorInfo, setActorInfo] = useState({});
  const [templateLayout, setTemplateLayout] = useState('');

  useEffect(() => {
    (async () => {
      const actor = await fetchActorDetail(props.actorUUID);
      const template = await fetchTemplateInfo(actor.template_uuid);

      setActorInfo(actor.info);
      setTemplateLayout(template.layout);
    })();
  }, []);

  return useMemo(() => {
    if (templateLayout === '') {
      return <Loading />;
    }

    const handleChange = (info: XMLBuilderState) => {
      setActorInfo(info.data);
      _isFunction(props.onChange) && props.onChange(info.data);
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

export default ActorEditor;
