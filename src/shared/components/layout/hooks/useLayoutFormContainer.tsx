import React from 'react';
import { LayoutProps } from '../processor';
import { useMemo } from 'react';
import { is } from '@shared/utils/string-helper';
import { BaseTypeRow } from '../tags/Base/shared';
import { LayoutCol } from '../tags/Col/shared';
import { TagLabel } from '../tags/Input/shared';

export const useLayoutFormContainer = (props: LayoutProps) => {
  const hideLabel = useMemo(() => {
    if (is(props.hideLabel)) {
      return true;
    } else {
      return false;
    }
  }, [props.hideLabel]);
  const desc = props.desc;

  return useMemo(() => {
    const FormContainer: React.FC<{ label: string }> = React.memo((props) => {
      return hideLabel ? (
        // 隐藏标签
        <BaseTypeRow>
          <LayoutCol span={24}>{props.children}</LayoutCol>
        </BaseTypeRow>
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

    return FormContainer;
  }, [hideLabel]);
};
