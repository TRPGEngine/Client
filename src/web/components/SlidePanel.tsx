import React, { useCallback, useEffect } from 'react';
import { hideSlidePanel } from '../../shared/redux/actions/ui';

import './SlidePanel.scss';
import { TMemo } from '@shared/components/TMemo';
import {
  useTRPGSelector,
  useTRPGDispatch,
} from '@shared/hooks/useTRPGSelector';

export const SlidePanel: React.FC = TMemo(() => {
  const isSlidePanelShow = useTRPGSelector((state) => state.ui.showSlidePanel);
  const showSlidePanelInfo = useTRPGSelector(
    (state) => state.ui.showSlidePanelInfo
  );
  const dispatch = useTRPGDispatch();

  const slideEvent = useCallback(() => {
    console.log('close slide panel with click window');
    window.removeEventListener('click', slideEvent);
    dispatch(hideSlidePanel());
  }, []);

  useEffect(() => {
    // 检测到显示滑动面板
    if (isSlidePanelShow === true) {
      setTimeout(() => {
        window.addEventListener('click', slideEvent);
      }, 500);
    }
  }, [isSlidePanelShow]);

  useEffect(() => {
    return () => window.removeEventListener('click', slideEvent);
  }, []);

  const handleHideSlidePanel = useCallback(() => {
    console.log('close slide panel with click btn');
    dispatch(hideSlidePanel());
    window.removeEventListener('click', slideEvent);
  }, [dispatch]);

  return (
    <div
      className={'slide-panel' + (isSlidePanelShow ? '' : ' hide')}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className="header">
        <div className="title">{showSlidePanelInfo.title}</div>
        <div className="close" onClick={handleHideSlidePanel}>
          <i className="iconfont">&#xe70c;</i>
        </div>
      </div>
      <div className="content">{showSlidePanelInfo.content}</div>
    </div>
  );
});
