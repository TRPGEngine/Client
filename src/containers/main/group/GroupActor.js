const React = require('react');
const { connect } = require('react-redux');
const { selectActor } = require('../../../redux/actions/actor');
const { showAlert, showModal } = require('../../../redux/actions/ui');
const { addGroupActor } = require('../../../redux/actions/group');
const ReactTooltip = require('react-tooltip');
const at = require('trpg-actor-template');
const { TabsController, Tab } = require('../../../components/Tabs');
const ActorProfile = require('../../../components/ActorProfile');
const ActorSelect = require('../../../components/modal/ActorSelect');
const GroupActorCheck = require('./modal/GroupActorCheck');

require('./GroupActor.scss')

class GroupActor extends React.Component {
  _handleSendGroupActorCheck() {
    if(!this.props.selectedGroupUUID) {
      showAlert('请选择一个团来提交您的人物');
    }

    this.props.showModal(
      <ActorSelect
        onSelect={(actorUUID) => {
          this.props.addGroupActor(this.props.selectedGroupUUID, actorUUID);
        }}
      />
    )
  }

  // 查看人物卡
  _handleShowActorProfile(actor) {
    if(actor) {
      this.props.showModal(
        <ActorProfile actor={actor}/>
      )
    }else {
      console.error('需要actor');
    }
  }

  // 审批人物
  _handleApprove(groupActorInfo) {
    if(groupActorInfo) {
      this.props.showModal(
        <GroupActorCheck groupActor={groupActorInfo} />
      )
    }else {
      console.error('需要groupActor');
    }
  }

  getGroupActorsList() {
    let groupActors = this.props.groupInfo.get('group_actors');
    if(groupActors && groupActors.size > 0) {
      return groupActors.filter(item => item.get('passed')===true).map((item) => {
        let originActor = item.get('actor');
        let actorData = originActor.get('info').merge(item.get('actor_info'));
        let template = this.props.templateCache.get(originActor.get('template_uuid'));
        let cells = [];
        if(template) {
          let info = at.parse(template.get('info'));
          info.setData(actorData);
          cells = info.getCells();
        }

        let tipHtml = cells.map((item) => {
          if(item.visibility) {
            return `<p>${item.name}: ${item.value}</p>`;
          }else {
            return null;
          }
        })
        tipHtml = tipHtml.join('');
        return (
          <div
            key={`group-actor#${item.get('uuid')}`}
            className="group-actor-item"
            data-html="true"
            data-tip={tipHtml}
            data-for="group-actor-info"
          >
            <div className="avatar" style={{backgroundImage: `url(${item.get('avatar') || originActor.get('avatar')})`}}></div>
            <div className="info">
              <div className="name">{originActor.get('name')}</div>
              <div className="desc">{originActor.get('desc')}</div>
              <div className="action">
                <button data-tip="查询" data-for="group-actor-check-action" onClick={() => this._handleShowActorProfile(originActor.toJS())}>
                  <i className="iconfont">&#xe61b;</i>
                </button>
              </div>
            </div>
          </div>
        )
      })
    }else {
      return (
        <div className="no-content">
          暂无卡片
        </div>
      )
    }
  }

  getGroupActorChecksList() {
    let groupActors = this.props.groupInfo.get('group_actors');
    if(groupActors && groupActors.size > 0) {
      return groupActors.filter(item => item.get('passed')===false).map((item) => {
        let originActor = item.get('actor');
        return (
          <div
            key={'group-actor-check#'+item.get('uuid')}
            className="group-actor-check-item"
          >
            <div className="avatar" style={{backgroundImage: `url(${originActor.get('avatar')})`}}></div>
            <div className="info">
              <div className="name">{originActor.get('name')}</div>
              <div className="desc">{originActor.get('desc')}</div>
              <div className="action">
                <button data-tip="查询" data-for="group-actor-check-action" onClick={() => this._handleShowActorProfile(originActor.toJS())}>
                  <i className="iconfont">&#xe61b;</i>
                </button>
                <button data-tip="审批" data-for="group-actor-check-action" onClick={() => this._handleApprove(item.toJS())}>
                  <i className="iconfont">&#xe83f;</i>
                </button>
              </div>
            </div>
          </div>
        )
      })
    }else {
      return (
        <div className="no-content">
          暂无卡片
        </div>
      )
    }
  }

  render() {
    return (
      <div className="group-actor">
        <TabsController>
          <Tab name="正式人物卡">
            <div className="formal-actor">
              <ReactTooltip effect="solid" place="left" id="group-actor-info" class="group-actor-info"/>
              <div className="group-actor-action">
                <button onClick={() => this._handleSendGroupActorCheck()}><i className="iconfont">&#xe604;</i>申请审核</button>
              </div>
              <div className="group-actor-items">
                {this.getGroupActorsList()}
              </div>
            </div>
          </Tab>
          <Tab name="待审人物卡">
            <div className="reserve-actor">
              <div className="group-actor-check-items">
                <ReactTooltip effect="solid" place="top" id="group-actor-check-action" class="group-actor-info"/>
                {this.getGroupActorChecksList()}
              </div>
            </div>
          </Tab>
        </TabsController>
      </div>
    )
  }
}

module.exports = connect(
  state => ({
    selectedGroupUUID: state.getIn(['group', 'selectedGroupUUID']),
    groupInfo: state
      .getIn(['group', 'groups'])
      .find((group) => group.get('uuid')===state.getIn(['group', 'selectedGroupUUID'])),
    templateCache: state.getIn(['cache', 'template']),
  }),
  dispatch => ({
    showAlert: (...args) => dispatch(showAlert(...args)),
    showModal: (...args) => dispatch(showModal(...args)),
    selectActor: (actorUUID) => dispatch(selectActor(actorUUID)),
    addGroupActor: (groupUUID, actorUUID) => dispatch(addGroupActor(groupUUID, actorUUID)),
  })
)(GroupActor);
