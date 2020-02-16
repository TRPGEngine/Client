import React, { useMemo } from 'react';
import TLoadable from '@web/components/TLoadable';
import { TagComponent } from '../type';
import _zip from 'lodash/zip';

const Radar = TLoadable(() =>
  import('./radar').then((module) => module.TRadar)
);

interface TagProps {
  dataKey: string | string[];
  dataValue: number[];
  height?: number;
}
export const TagRadarShared: TagComponent<TagProps> = React.memo((props) => {
  const dataKey = useMemo(() => {
    if (typeof props.dataKey === 'string') {
      return props.dataKey.split(',');
    }

    return props.dataKey ?? [];
  }, [props.dataKey]);

  const data = useMemo(() => {
    return _zip(dataKey, props.dataValue).map(([name, value]) => ({
      name,
      value,
    }));
  }, [props.dataValue]);

  return <Radar data={data} height={props.height} />;
});
TagRadarShared.displayName = 'TagRadarShared';
