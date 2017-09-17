const React = require('react');
const PropTypes = require('prop-types');

require('./TemplateCell.scss');

class TemplateCell extends React.Component {
  constructor(props) {
    super(props);
  }

  render()　{
    let { name, value, onEdit, onRemove, isActive } = this.props;

    return (
      <div className={"template-cell" + (isActive?" active":"")}>
        <div className="property">{name} : {value}</div>
        <div className="actions">
          <button title="编辑" onClick={onEdit}>
            <i className="iconfont">&#xe83f;</i>
          </button>
          <button title="删除" onClick={onRemove}>
            <i className="iconfont">&#xe76b;</i>
          </button>
        </div>
      </div>
    )
  }
}

TemplateCell.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  onEdit: PropTypes.func,
  onRemove: PropTypes.func,
}

module.exports = TemplateCell;
