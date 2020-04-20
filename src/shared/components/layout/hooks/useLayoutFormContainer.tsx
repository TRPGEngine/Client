import React from 'react';
import { LayoutProps } from '../processor';
import { useMemo } from 'react';
import { is } from '@shared/utils/string-helper';
import { BaseTypeRow } from '../tags/Base/shared';
import { LayoutCol } from '../tags/Col/shared';
import { TagLabel } from '../tags/Input/shared';
import { TMemo } from '@shared/components/TMemo';
import { useToBoolean } from '@shared/hooks/useToBoolean';

export interface LayoutFormContainerProps extends LayoutProps {
  hideLabel?: boolean;
  label?: string;
  desc?: string;
}

export const useLayoutFormContainer = (props: LayoutProps) => {
  const hideLabel = useToBoolean(props.hideLabel);
  const desc = props.desc;

  return useMemo(() => {
    const FormContainer: React.FC<{ label: string }> = TMemo((props) => {
      return hideLabel ? (
        // 隐藏标签
        <LayoutCol span={24}>{props.children}</LayoutCol>
      ) : (
        // 显示标签
        <BaseTypeRow>
          <LayoutCol span={6}>
            <TagLabel label={props.label} desc={desc} />
          </LayoutCol>
          <LayoutCol span={18}>{props.children}</LayoutCol>
        </BaseTypeRow>
      );
    });
    FormContainer.displayName = 'FormContainer';

    return FormContainer;
  }, [hideLabel]);
};
