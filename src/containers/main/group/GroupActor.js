const React = require('react');
const { connect } = require('react-redux');
const { showAlert } = require('../../../redux/actions/ui');
const ReactTooltip = require('react-tooltip');
const at = require('trpg-actor-template');
const Tab = require('../../../components/Tab');

require('./GroupActor.scss')

class GroupActor extends React.Component {
  _handleSendGroupActorCheck() {
    if(!this.props.selectedGroupUUID) {
      showAlert('请选择一个团来提交您的人物');
    }

    // TODO: 团人物审核模态框
  }

  getGroupActorsList() {
    let actors = this.props.groupInfo.get('group_actors');
    if(actors) {
      return actors.map((item) => {
        let originActor = item.get('actor');
        let actorData = originActor.get('info').merge(item.get('actor_info'));
        let template = this.props.templateCache.get(originActor.get('template_uuid'));
        let cells = [];
        if(template) {
          let info = at.parse(template.get('info'));
          info.setData(actorData);
          cells = info.getCells();
          console.log(info.getCells());
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
            </div>
          </div>
        )
      })
    }
  }

  render() {
    return (
      <div className="group-actor">
        <Tab
          items={[
            {
              name: '正式人物卡',
              component: (
                <div className="formal-actor">
                  <ReactTooltip effect="solid" place="left" id="group-actor-info" class="group-actor-info"/>
                  <div className="group-actor-action">
                    <button onClick={() => this._handleSendGroupActorCheck()}><i className="iconfont">&#xe604;</i>申请审核</button>
                  </div>
                  <div className="group-actor-items">
                    {this.getGroupActorsList()}
                  </div>
                </div>
              )
            },
            {
              name: '待审人物卡',
              component: (
                <div className="reserve-actor">aaaaa</div>
              )
            }
          ]}
        />
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
  })
)(GroupActor);
