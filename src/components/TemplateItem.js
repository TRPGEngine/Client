const React = require('react');

require('./TemplateItem.scss');

class TemplateItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render()　{
    return (
      <div className="template-item">
        <div className="name">无限恐怖人物卡</div>
        <div className="desc">无限恐怖人物卡无限恐怖人物卡无限恐怖人物卡无限恐怖人物卡</div>
        <div className="footer">
          <div className="creator" title="moonrailgun">moonrailgun</div>
          <div className="time">2017-9-17 17:42:35</div>
        </div>
      </div>
    )
  }
}

module.exports = TemplateItem;
