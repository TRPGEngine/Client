const React = require('react');
const { connect } = require('react-redux');
const PropTypes = require('prop-types');
const at = require('trpg-actor-template');
const ReactTooltip = require('react-tooltip');

require('./ActorProfile.scss');

class ActorProfile extends React.Component {
  constructor(props) {
    super(props);
  }

  getActorProperty(actor, template) {
    if (!template) {
      console.error('缺少模板信息');
      return;
    }

    let templateInfo = at.parse(template.get('info'));
    templateInfo.setData(actor.info);
    // console.log(templateInfo);

    // let finalData = Object.assign({}, template.get('info'), this.props.editingData);

    return templateInfo.getCells().map((item, index) => {
      let name = item.name;
      let value = this.props.overwritedActorData[name] || item.value;
      return (
        <div
          key={`actor-property#${actor.uuid}#${index}`}
          className="actor-property-cell"
          data-tip={item.desc}
          data-for="property-desc"
        >
          <span>{name}:</span>
          <span
            style={{
              textDecoration: this.props.editingData[name]
                ? 'line-through'
                : 'initial',
            }}
          >
            {value}
          </span>
          {this.props.canEdit && (
            <input
              type="text"
              value={this.props.editingData[name] || ''}
              disabled={item.func === 'expression'}
              onChange={(e) => {
                this.props.onEditData &&
                  this.props.onEditData(name, e.target.value);
              }}
            />
          )}
        </div>
      );
    });
  }

  render() {
    let actor = this.props.actor;
    let template = this.props.templateCache.get(actor.template_uuid);
    // console.log(actor, template.toJS());
    return (
      <div className="actor-profile">
        <ReactTooltip effect="solid" id="property-desc" place="left" />
        <div className="profile">
          <div className="name">{actor.name}</div>
          <div className="uuid" title={actor.uuid}>
            {actor.uuid}
          </div>
          <div
            className="avatar"
            style={{ backgroundImage: `url(${actor.avatar})` }}
          />
          <div className="desc">{actor.desc}</div>
        </div>
        <div className="property">{this.getActorProperty(actor, template)}</div>
      </div>
    );
  }
}

ActorProfile.defaultProps = {
  canEdit: false,
  editingData: {},
  overwritedActorData: {},
};

ActorProfile.propTypes = {
  actor: PropTypes.object.isRequired,
  canEdit: PropTypes.bool,
  editingData: PropTypes.object,
  onEditData: PropTypes.func,
  overwritedActorData: PropTypes.object, // 一般用于团角色的人物信息, 只读
};

module.exports = connect((state) => ({
  templateCache: state.getIn(['cache', 'template']),
}))(ActorProfile);
