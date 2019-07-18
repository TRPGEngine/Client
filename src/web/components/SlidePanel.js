import React from 'react';
import { connect } from 'react-redux';
import { hideSlidePanel } from '../../redux/actions/ui';
import { isImmutable } from 'immutable';

import './SlidePanel.scss';

class SlidePanel extends React.Component {
  constructor(props) {
    super(props);
    this.slideEvent = () => {
      console.log('close slide panel with click window');
      window.removeEventListener('click', this.slideEvent);
      this.props.dispatch(hideSlidePanel());
    };
  }

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

  _handleHideSlidePanel() {
    console.log('close slide panel with click btn');
    this.props.dispatch(hideSlidePanel());
    window.removeEventListener('click', this.slideEvent);
  }

  render() {
    const showSlidePanelInfo = this.props.showSlidePanelInfo;
    let content = showSlidePanelInfo.get('content');
    if (isImmutable(content)) {
      content = content.toJS();
    }

    console.log('showSlidePanelInfo', showSlidePanelInfo);

    return (
      <div
        className={'slide-panel' + (this.props.isSlidePanelShow ? '' : ' hide')}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="header">
          <div className="title">{showSlidePanelInfo.get('title')}</div>
          <div className="close" onClick={() => this._handleHideSlidePanel()}>
            <i className="iconfont">&#xe70c;</i>
          </div>
        </div>
        <div className="content">{content}</div>
      </div>
    );
  }
}

export default connect((state) => {
  let slidePanelContent = state.getIn(['ui', 'showSlidePanelInfo', 'content']);

  return {
    isSlidePanelShow: state.getIn(['ui', 'showSlidePanel']),
    slidePanelTitle: state.getIn(['ui', 'showSlidePanelInfo', 'title']),
    showSlidePanelInfo: state.getIn(['ui', 'showSlidePanelInfo']),
  };
})(SlidePanel);
