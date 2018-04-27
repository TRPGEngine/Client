const React = require('react');
const { connect } = require('react-redux');
const { hideSlidePanel } = require('../../redux/actions/ui');

require('./SlidePanel.scss');

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
    if(this.props.isSlidePanelShow === false && nextProps.isSlidePanelShow === true) {
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
    return (
      <div
        className={'slide-panel' + (this.props.isSlidePanelShow?'':' hide')}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="header">
          <div className="title">{this.props.slidePanelTitle}</div>
          <div
            className="close"
            onClick={() => this._handleHideSlidePanel()}
          >
            <i className="iconfont">&#xe70c;</i>
          </div>
        </div>
        <div className="content">
          {this.props.slidePanelContent}
        </div>
      </div>
    )
  }
}

module.exports = connect(
  state => {
    let slidePanelContent = state.getIn(['ui', 'showSlidePanelInfo', 'content']);
    if(typeof slidePanelContent === 'object') {
      slidePanelContent = slidePanelContent.toJS();
    }
    return {
      isSlidePanelShow: state.getIn(['ui', 'showSlidePanel']),
      slidePanelTitle: state.getIn(['ui', 'showSlidePanelInfo', 'title']),
      slidePanelContent,
    }
  }
)(SlidePanel);
