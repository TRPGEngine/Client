import React, { useState, useMemo } from 'react';
import ReactJson from 'react-json-view';
import { XMLBuilderState } from '@shared/components/layout/XMLBuilder';
import _debounce from 'lodash/debounce';

/**
 * 监控布局状态
 */
export function useStateWatcher(renderKey: number) {
  const [currentData, setCurrentData] = useState({});
  const [currentGlobal, setCurrentGlobal] = useState({});

  const updateWatcherState = useMemo(
    () =>
      _debounce((newState: XMLBuilderState) => {
        // 此处使用debounce降低资源消耗
        setCurrentData(newState.data);
        setCurrentGlobal(newState.global);
      }, 200),
    []
  );

  const stateDataEl = useMemo(() => {
    return (
      <ReactJson
        name={false}
        style={{ fontFamily: 'inherit' }}
        src={currentData}
        enableClipboard={false}
        displayObjectSize={false}
        displayDataTypes={false}
      />
    );
  }, [currentData, renderKey]);

  const stateGlobalDataEl = useMemo(() => {
    return (
      <ReactJson
        name="全局变量"
        style={{ fontFamily: 'inherit' }}
        src={currentGlobal}
        enableClipboard={false}
        displayObjectSize={false}
        displayDataTypes={false}
        collapsed={1}
      />
    );
  }, [currentGlobal, renderKey]);

  return {
    stateDataEl,
    stateGlobalDataEl,
    updateWatcherState,
  };
}
