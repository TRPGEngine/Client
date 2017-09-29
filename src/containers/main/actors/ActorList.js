const React = require('react');
const { connect } = require('react-redux');
const TemplateSelect = require('./TemplateSelect');
const { showModal } = require('../../../redux/actions/ui');
const { selectActor } = require('../../../redux/actions/actor');

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

  getActorList() {
    return this.props.actors.map((item, index) => {
      let uuid = item.get('uuid');
      let backgroundStyle = {
        backgroundImage: `url(${item.get('avatar')})`
      };
      let actorname = item.get('name');
      let desc = item.get('desc')
      return (
        <div className="actor-card" key={uuid + '-' + index}>
          <div className="avatar" style={backgroundStyle}></div>
          <div className="profile">
            <p><span>角色:</span><span title={actorname}>{actorname}</span></p>
            <p><span>说明:</span><span title={desc}>{desc}</span></p>
            <p className="action">
              <button>删除</button>
              <button>编辑</button>
              <button onClick={() => this.props.selectActor(uuid)}>查看</button>
            </p>
          </div>
        </div>
      )
    })
  }

  getActorInfo() {
    let actor;
    for (let _actor of this.props.actors) {
      if(_actor.get('uuid') === this.props.selectedActorUUID) {
        actor = _actor;
        break;
      }
    }

    if(actor) {
      return (
        <div>
          <p><span>人物卡:</span><span>{actor.get('name')}</span></p>
          <p><span>背景:</span><span>{actor.get('desc')}</span></p>
          {
            actor.get('info').entrySeq().map((item, index) => {
              return (
                <p key={actor.get('uuid')+index}>
                  <span>{item[0]}:</span><span>{item[1]}</span>
                </p>
              )
            })
          }
        </div>
      )
    }else {
      return (
        <div>
          没有信息
        </div>
      )
    }
  }

  render() {
    // let text = "名副其实的重度网络游戏玩家。拥有超群的反射神经和洞察力。因为完全潜行正式版的SAO而被卷入死亡游戏，并以此为开端，牵扯进各种的虚拟世界事件。五官看起来像少女一样纤细，态度却非常冷淡，给人一种“捉摸不定”、“年龄不详”的印象。";
    let addNewCard = (
      <div className="actor-card">
        <div className="actor-card-new" onClick={() => this._handleAddNewActor()}>
          <i className="iconfont">&#xe604;</i><span>添加新人物</span>
        </div>
      </div>
    )
    // let skill = '<p>【雷霆天降】</p><p>重范围攻击</p><p>【音速冲击】</p><p>单手直剑基本技、上段突进技</p>';
    // let cardInfo = (
    //   <div>
    //     <p><span>姓名:</span><span>桐谷和人</span></p>
    //     <p><span>背景:</span><span>{text}</span></p>
    //     <p><span>年龄:</span><span>19</span></p>
    //     <p><span>力量:</span><span>20</span></p>
    //     <p><span>敏捷:</span><span>28</span></p>
    //     <p><span>体质:</span><span>16</span></p>
    //     <p><span>智力:</span><span>22</span></p>
    //     <p><span>魅力:</span><span>26</span></p>
    //     <p><span>金币:</span><span>1000</span></p>
    //     <p><span>技能:</span><span dangerouslySetInnerHTML={{__html: skill}}></span></p>
    //   </div>
    // )
    return (
      <div className="actor">
        <div className="actor-list">
          <div className="actor-list-collection">
            { this.getActorList() }
            { addNewCard }
          </div>
        </div>
        <div className="actor-info">
          { this.getActorInfo() }
        </div>
      </div>
    )
  }
}

module.exports = connect(
  state => ({
    actors: state.getIn(['actor', 'selfActors']),
    selectedActorUUID: state.getIn(['actor', 'selectedActorUUID']),
  }),
  dispatch => ({
    showModal: (body) => dispatch(showModal(body)),
    selectActor: (uuid) => dispatch(selectActor(uuid)),
  })
)(ActorList);
