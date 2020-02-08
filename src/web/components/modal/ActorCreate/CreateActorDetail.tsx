import React from 'react';
import XMLBuilder, { DataMap } from '@shared/components/layout/XMLBuilder';
import _clone from 'lodash/clone';
import { ActorTemplateType } from '@redux/types/actor';

interface Props {
  template: ActorTemplateType;
  data: DataMap;
  onChange: (state: DataMap) => void;
}
const CreateActorDetail = (props: Props) => {
  const template = props.template;

  return (
    <div>
      <XMLBuilder
        xml={template.layout}
        initialData={props.data}
        onChange={(state) => {
          const data = state.data;
          props.onChange && props.onChange(_clone(data));
        }}
      />
    </div>
  );
};

export default CreateActorDetail;
