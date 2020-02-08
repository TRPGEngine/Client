import React from 'react';
import Base, {
  ILayoutTypeAttributes,
  ILayoutType,
  LayoutTypeContext,
} from './Base';
import styled from 'styled-components';

const TemplateContainer = styled.div`
  padding: 10px;
`;

interface Attr extends ILayoutTypeAttributes {}

/**
 * 基础模板容器
 */
export default class Template extends Base implements ILayoutType<Attr> {
  name: string = 'Template';

  getEditView(ctx: LayoutTypeContext<Attr>) {
    const { elements, context } = ctx;

    return (
      <TemplateContainer>
        {this.renderChildren(elements, context)}
      </TemplateContainer>
    );
  }

  getDetailView(ctx: LayoutTypeContext<Attr>) {
    return this.getEditView(ctx);
  }
}
