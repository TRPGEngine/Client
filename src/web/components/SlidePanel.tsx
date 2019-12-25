import React from 'react';
import { connect } from 'react-redux';
import { hideSlidePanel } from '../../shared/redux/actions/ui';
import { TRPGDispatchProp, TRPGState } from '@src/shared/redux/types/__all__';

import './SlidePanel.scss';

interface Props extends TRPGDispatchProp {
  isSlidePanelShow: boolean;
  showSlidePanelInfo: {
    title: string;
    content: any;
  };
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
    const content = showSlidePanelInfo.content;

    return (
      <div
        className={'slide-panel' + (isSlidePanelShow ? '' : ' hide')}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="header">
          <div className="title">{showSlidePanelInfo.title}</div>
          <div className="close" onClick={() => this.handleHideSlidePanel()}>
            <i className="iconfont">&#xe70c;</i>
          </div>
        </div>
        <div className="content">{content}</div>
      </div>
    );
  }
}

export default connect((state: TRPGState) => {
  return {
    isSlidePanelShow: state.ui.showSlidePanel,
    showSlidePanelInfo: state.ui.showSlidePanelInfo,
  };
})(SlidePanel);
