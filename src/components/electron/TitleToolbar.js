const React = require('react');
const ipcRenderer = require('electron').ipcRenderer;

require('./TitleToolbar.scss');

class TitleToolbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isBig: false
    }
  }

  _handleClose() {
    ipcRenderer.send('close-window');
  }

  _handleMinimize() {
    ipcRenderer.send('hide-window');
  }

  _handleMaximize() {
    if(this.state.isBig) {
      ipcRenderer.send('orignal-window');
      this.setState({isBig: false});
    }else {
      ipcRenderer.send('show-window');
      this.setState({isBig: true});
    }
  }

  render() {
    return (
      <div className="electron-title-toolbar">
        <button title="最小化" onClick={() => this._handleMinimize()}><i className="iconfont">&#xe657;</i></button>
        <button title="最大化" onClick={() => this._handleMaximize()}>
          {
            this.state.isBig ? (
              <i className="iconfont">&#xe618;</i>
            ) : (
              <i className="iconfont">&#xe60c;</i>
            )
          }
        </button>
        <button title="退出" onClick={() => this._handleClose()}><i className="iconfont">&#xe610;</i></button>
      </div>
    )
  }
}

module.exports = TitleToolbar;
