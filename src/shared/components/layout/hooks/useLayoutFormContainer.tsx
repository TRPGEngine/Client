import React from 'react';
import type { LayoutProps } from '../processor';
import { useMemo } from 'react';
import { BaseTypeRow } from '../tags/Base/shared';
import { LayoutCol } from '../tags/Col/shared';
import { TagLabel } from '../tags/Input/shared';
import { TMemo } from '@shared/components/TMemo';
import { useToBoolean } from '@shared/hooks/useToBoolean';
import { Row, Col } from 'antd';

export interface LayoutFormContainerProps extends LayoutProps {
  hideLabel?: boolean;
  label?: string;
  desc?: string;
  style?: React.CSSProperties;
  inline?: boolean; // 行内模式
}

export const useLayoutFormContainer = (props: LayoutProps) => {
  const hideLabel = useToBoolean(props.hideLabel);
  const inline = useToBoolean(props.inline);
  const desc = props.desc;

  // style 的结果是一个对象 不太好比较因此只获取第一次的结果
  // 当然也可以使用JSON.stringify 但是可能会有性能问题，目前无必要
  const style = props.style;

  return useMemo(() => {
    const FormContainer: React.FC<{ label: string }> = TMemo((props) => {
      if (inline === true) {
        return hideLabel ? (
          <div style={style}>{props.children}</div>
        ) : (
          <Row style={style}>
            <Col>
              <TagLabel label={props.label} desc={desc} />
            </Col>
            <Col>
              <LayoutCol>{props.children}</LayoutCol>
            </Col>
          </Row>
        );
      } else {
        return hideLabel ? (
          // 隐藏标签
          <LayoutCol style={style} span={24}>
            {props.children}
          </LayoutCol>
        ) : (
          // 显示标签
          <BaseTypeRow style={style}>
            <LayoutCol span={6}>
              <TagLabel label={props.label} desc={desc} />
            </LayoutCol>
            <LayoutCol span={18}>{props.children}</LayoutCol>
          </BaseTypeRow>
        );
      }
    });
    FormContainer.displayName = 'FormContainer';

    return FormContainer;
  }, [hideLabel, inline]);
};
