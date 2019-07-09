import React from 'react';
import { TemplateType } from './TemplateSelect';
import XMLBuilder, { DataType } from '@shared/layout/XMLBuilder';
import _clone from 'lodash/clone';

interface Props {
  template: TemplateType;
  data: DataType;
  onChange: (state: DataType) => void;
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
