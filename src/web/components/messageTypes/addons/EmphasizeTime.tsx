import React, { useMemo } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { getShortDate } from '@shared/utils/date-helper';
import styled from 'styled-components';
import { buildTransparentColorWithHex } from '@shared/utils/color-helper';

const Root = styled.div`
  text-align: center;

  > span {
    color: ${(props) =>
      props.theme.style.mode === 'light'
        ? 'white'
        : props.theme.color.interactiveNormal};
    font-size: 12px;
    padding: 1px 5px;
    background-color: ${(props) =>
      props.theme.style.mode === 'light'
        ? buildTransparentColorWithHex(props.theme.color.silver, 0.5)
        : 'transparent'};
    border-radius: 3px;
  }
`;

interface EmphasizeTimeProps {
  date: string;
}
export const EmphasizeTime: React.FC<EmphasizeTimeProps> = TMemo((props) => {
  const dateStr = useMemo(() => getShortDate(props.date), [props.date]);

  return (
    <Root>
      <span>{dateStr}</span>
    </Root>
  );
});
EmphasizeTime.displayName = 'EmphasizeTime';
