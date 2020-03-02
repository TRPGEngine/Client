import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Tooltip,
  TooltipProps,
  ResponsiveContainer,
} from 'recharts';
import styled from 'styled-components';
import _get from 'lodash/get';
import { TMemo } from '@shared/components/TMemo';

interface RadarData {
  name: string;
  value: number;
}

interface Props {
  data: RadarData[];
  height?: number;
}

const CustomTooltipContainer = styled.div`
  background-color: white;
  padding: 10px;
  border-radius: ${(props) => props.theme.radius.standard};
  box-shadow: ${(props) => props.theme.boxShadow.normal};
`;

const CustomTooltip: React.FC<TooltipProps> = TMemo(
  ({ active, payload, label }) => {
    if (active) {
      return (
        <CustomTooltipContainer>
          <div>{`${label} : ${_get(payload, '0.value')}`}</div>
        </CustomTooltipContainer>
      );
    }

    return null;
  }
);

export const TRadar: React.FC<Props> = TMemo((props) => {
  const height = props.height ?? 300;

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <RadarChart data={props.data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="name" />
          <Tooltip content={<CustomTooltip />} />
          <Radar
            dataKey="value"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
});
TRadar.displayName = 'TRadar';

export default TRadar;
