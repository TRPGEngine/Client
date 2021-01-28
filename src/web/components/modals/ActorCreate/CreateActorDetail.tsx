import React, { useCallback, useMemo } from 'react';
import XMLBuilder, {
  XMLBuilderState,
  DataMap,
} from '@shared/components/layout/XMLBuilder';
import _clone from 'lodash/clone';
import type { ActorTemplateType } from '@redux/types/actor';
import { TMemo } from '@shared/components/TMemo';

interface Props {
  template: ActorTemplateType;
  data: DataMap;
  onChange: (state: DataMap) => void;
}
const CreateActorDetail: React.FC<Props> = TMemo((props) => {
  const template = props.template;

  const handleChange = useCallback(
    (state: XMLBuilderState) => {
      const data = state.data;
      props.onChange && props.onChange(_clone(data));
    },
    [props.onChange]
  );

  return useMemo(
    () => (
      <div>
        <XMLBuilder
          xml={template.layout}
          initialData={props.data}
          onChange={handleChange}
        />
      </div>
    ),
    [template.layout, props.data, handleChange]
  );
});
CreateActorDetail.displayName = 'CreateActorDetail';

export default CreateActorDetail;
