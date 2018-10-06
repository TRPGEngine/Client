const React = require('react');
const Base = require('./Base');

class Card extends Base {
  getCardView() {
    let info = this.props.info;
    let data = info.data;

    return (
      <div>{'card view'} {data.type}</div>
    )
  }

  getCardAction() {
    return null;
  }

  getContent() {
    let info = this.props.info;
    let data = info.data;
    console.log('TODO: card info', info);
    // TODO: 需要实现各个类型的card方法

    return (
      <div className="bubble">
        <div className="card-title">
          {data.title}
        </div>
        {this.getCardView()}
        {this.getCardAction()}
      </div>
    )
  }
}

module.exports = Card;
