import React, { useMemo } from 'react';
import { useLayoutChildren } from '@shared/components/layout/hooks/useLayoutChildren';
import type { TagComponent } from '../type';
import styled from 'styled-components';
import _isEmpty from 'lodash/isEmpty';
import { TMemo } from '@shared/components/TMemo';

const padding = 10;

const Container = styled.div<{ left: number }>`
  margin-top: ${padding}px;
  padding: ${padding}px;
  padding-top: ${padding + 5}px;
  border-left: ${(props) => props.theme.border.standard};
  border-bottom: ${(props) => props.theme.border.standard};
  border-right: ${(props) => props.theme.border.standard};
  position: relative;

  .fieldset-divider {
    position: absolute;
    display: table;
    top: -${padding}px;
    width: 100%;
    left: 0;
    right: 0;
    color: ${(props) =>
      props.theme.mixins.modeValue(['rgba(0, 0, 0, 0.85)', 'white'])};
    font-weight: 500;
    font-size: 16px;
    white-space: nowrap;
    text-align: center;

    &::before {
      top: 10px;
      width: ${(props) => props.left}%;
      display: table-cell;
      position: relative;
      content: '';
      border-top: ${(props) => props.theme.border.standard};
    }

    &::after {
      top: 10px;
      width: ${(props) => 100 - props.left}%;
      display: table-cell;
      position: relative;
      content: '';
      border-top: ${(props) => props.theme.border.standard};
    }

    .inner-text {
      display: inline-block;
      padding: 0 ${padding}px;
    }
  }
`;

interface TagProps {
  label: string;
  orientation?: 'left' | 'right' | 'center';
}
export const TagFieldSetShared: TagComponent<TagProps> = TMemo((props) => {
  const children = useLayoutChildren(props);

  const orientation = useMemo(
    () =>
      ['left', 'right', 'center'].includes(props.orientation!)
        ? props.orientation
        : 'left',
    [props.orientation]
  );

  const left = useMemo(() => {
    if (orientation === 'center') {
      return 50;
    } else if (orientation === 'right') {
      return 95;
    } else {
      return 5;
    }
  }, [orientation]);

  const label = useMemo(
    () => (
      <div className="fieldset-divider">
        {!_isEmpty(props.label) && (
          <span className="inner-text">{props.label}</span>
        )}
      </div>
    ),
    [props.label]
  );

  return (
    <Container left={left}>
      {label}
      {children}
    </Container>
  );
});
TagFieldSetShared.displayName = 'TagFieldSetShared';
