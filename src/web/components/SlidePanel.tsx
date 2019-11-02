import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { hideSlidePanel } from '../../shared/redux/actions/ui';
import { isImmutable, Collection, Record } from 'immutable';

import './SlidePanel.scss';
import { memoImmutableNode } from '../utils/memo-helper';
import { TRPGDispatchProp } from '@src/shared/redux/types/__all__';

interface Props extends TRPGDispatchProp {
  isSlidePanelShow: boolean;
  showSlidePanelInfo: Record<{
    title: string;
    content: Collection<any, any>;
  }>;
}
class SlidePanel extends React.Component<Props> {
  slideEvent = () => {
    console.log('close slide panel with click window');
    window.removeEventListener('click', this.slideEvent);
    this.props.dispatch(hideSlidePanel());
  };

  componentWillUpdate(nextProps, nextState) {
    if (
      this.props.isSlidePanelShow === false &&
      nextProps.isSlidePanelShow === true
    ) {
      // 检测到显示滑动面板
      setTimeout(() => {
        window.addEventListener('click', this.slideEvent);
      }, 500);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.slideEvent);
  }

  handleHideSlidePanel() {
    console.log('close slide panel with click btn');
    this.props.dispatch(hideSlidePanel());
    window.removeEventListener('click', this.slideEvent);
  }

  render() {
    const { showSlidePanelInfo, isSlidePanelShow } = this.props;
    const content = memoImmutableNode(showSlidePanelInfo.get('content'));

    return (
      <div
        className={'slide-panel' + (isSlidePanelShow ? '' : ' hide')}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="header">
          <div className="title">{showSlidePanelInfo.get('title')}</div>
          <div className="close" onClick={() => this.handleHideSlidePanel()}>
            <i className="iconfont">&#xe70c;</i>
          </div>
        </div>
        <div className="content">{content}</div>
      </div>
    );
  }
}

export default connect((state: any) => {
  return {
    isSlidePanelShow: state.getIn(['ui', 'showSlidePanel']),
    showSlidePanelInfo: state.getIn(['ui', 'showSlidePanelInfo']),
  };
})(SlidePanel);
