const React = require('react');
const { connect } = require('react-redux');
const TemplateSelect = require('./TemplateSelect');
const { showModal } = require('../../../redux/actions/ui');

require('./ActorList.scss');

class ActorList extends React.Component {
  constructor(props) {
    super(props);
  }

  _handleAddNewActor() {
    this.props.showModal(
      <TemplateSelect />
    )
  }

  render() {
    let text = "名副其实的重度网络游戏玩家。拥有超群的反射神经和洞察力。因为完全潜行正式版的SAO而被卷入死亡游戏，并以此为开端，牵扯进各种的虚拟世界事件。五官看起来像少女一样纤细，态度却非常冷淡，给人一种“捉摸不定”、“年龄不详”的印象。";
    // let imgUrl = "/src/assets/img/gugugu1.png";
    let imgUrl = "/src/assets/img/actor.jpeg";
    let backgroundStyle = {
      backgroundImage: 'url(' + imgUrl + ')'
    }
    let actorCard = (
      <div className="actor-card">
        <div className="avatar" style={backgroundStyle}></div>
        <div className="profile">
          <p><span>角色:</span><span title="桐谷和人">桐谷和人</span></p>
          <p><span>说明:</span><span title={text}>{text}</span></p>
          <p className="action">
            <button>删除</button>
            <button>编辑</button>
            <button>查看</button>
          </p>
        </div>
      </div>
    )
    let addNewCard = (
      <div className="actor-card">
        <div className="actor-card-new" onClick={() => this._handleAddNewActor()}>
          <i className="iconfont">&#xe604;</i><span>添加新人物</span>
        </div>
      </div>
    )
    let skill = '<p>【雷霆天降】</p><p>重范围攻击</p><p>【音速冲击】</p><p>单手直剑基本技、上段突进技</p>';
    let cardInfo = (
      <div>
        <p><span>姓名:</span><span>桐谷和人</span></p>
        <p><span>背景:</span><span>{text}</span></p>
        <p><span>年龄:</span><span>19</span></p>
        <p><span>力量:</span><span>20</span></p>
        <p><span>敏捷:</span><span>28</span></p>
        <p><span>体质:</span><span>16</span></p>
        <p><span>智力:</span><span>22</span></p>
        <p><span>魅力:</span><span>26</span></p>
        <p><span>金币:</span><span>1000</span></p>
        <p><span>技能:</span><span dangerouslySetInnerHTML={{__html: skill}}></span></p>
      </div>
    )
    return (
      <div className="actor">
        <div className="actor-list">
          <div className="actor-list-collection">
            {actorCard}
            {actorCard}
            {addNewCard}
          </div>
        </div>
        <div className="actor-info">
          {cardInfo}
        </div>
      </div>
    )
  }
}

module.exports = connect(
  state => ({
    actors: [],
  }),
  dispatch => ({
    showModal: (body) => dispatch(showModal(body))
  })
)(ActorList);
