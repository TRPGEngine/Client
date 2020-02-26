import React, { useMemo } from 'react';
import TLoadable from '@web/components/TLoadable';
import { TagComponent } from '../type';
import _zip from 'lodash/zip';
import { useDeepCompareMemo } from '@shared/hooks/useDeepCompareMemo';
import { TMemo } from '@shared/components/TMemo';

const Radar = TLoadable(() =>
  import('./radar').then((module) => module.TRadar)
);

interface TagProps {
  dataKey: string | string[];
  dataValue: number[];
  height?: number;
}
export const TagRadarShared: TagComponent<TagProps> = TMemo((props) => {
  const dataKey = useMemo(() => {
    if (typeof props.dataKey === 'string') {
      return props.dataKey.split(',');
    }

    return props.dataKey ?? [];
  }, [props.dataKey]);

  const data = useDeepCompareMemo(() => {
    return _zip(dataKey, props.dataValue).map(([name, value]) => ({
      name,
      value: value ?? 0,
    }));
  }, [props.dataValue]);

  return useMemo(() => <Radar data={data} height={props.height} />, [
    data,
    props.height,
  ]);
});
TagRadarShared.displayName = 'TagRadarShared';
