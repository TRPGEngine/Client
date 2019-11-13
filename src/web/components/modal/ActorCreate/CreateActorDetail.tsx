import React from 'react';
import { TemplateType } from './TemplateSelect';
import XMLBuilder, { DataMap } from '@shared/layout/XMLBuilder';
import _clone from 'lodash/clone';

interface Props {
  template: TemplateType;
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
