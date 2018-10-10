const React = require('react');

class BaseCard extends React.Component {
  // 获取卡片视图
  getCardView() {
    let info = this.props.info;
    let data = info.data;

    return (
      <pre className="card-content">
        {info.message}
      </pre>
    )
  }

  // 返回一个形如:[{label: '按钮1', onClick:()=>{}}]的数组
  getCardBtn() {
    return [];
  }

  // 获取卡片动作
  getCardAction() {
    let btns = this.getCardBtn();
    if(!btns || btns.length === 0) {
      return null;
    }

    return (
      <div className="card-action">
        {
          btns.map((btn, index) => {
            let {
              label = '',
              onClick
            } = btn;
            return (
              <button
                key={`${index}#${btn.label}`}
                {...btn.attrs}
                onClick={btn.onClick}
                disabled={!btn.onClick}
              >{btn.label}</button>
            )
          })
        }
      </div>
    )
  }

  // 获取卡片标题
  getCardTitle() {
    if(this.props.info && this.props.info.data && this.props.info.data.title) {
      return (
        <div className="card-title">
          {this.props.info.data.title}
        </div>
      )
    }

    return null;
  }

  render() {
    let info = this.props.info;
    let data = info.data;

    return (
      <div className="bubble">
        {this.getCardTitle()}
        {this.getCardView()}
        {this.getCardAction()}
      </div>
    )
  }
}

module.exports = BaseCard;
