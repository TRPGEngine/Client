import React, {
  useState,
  useEffect,
  useMemo,
  PropsWithChildren,
  useCallback,
} from 'react';
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
const ActorEditor: React.FC<PropsWithChildren<Props>> = (props) => {
  const [actorInfo, setActorInfo] = useState({});
  const [templateLayout, setTemplateLayout] = useState('');

  // 修改角色数据
  const changeActorData = useCallback((data: DataMap) => {
    setActorInfo(data);
    _isFunction(props.onChange) && props.onChange(data);
  }, []);

  useEffect(() => {
    (async () => {
      const actor = await fetchActorDetail(props.actorUUID);
      const template = await fetchTemplateInfo(actor.template_uuid);

      changeActorData(actor.info);
      setTemplateLayout(template.layout);
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

export default ActorEditor;
