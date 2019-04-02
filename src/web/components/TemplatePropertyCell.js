import React from 'react';
import PropTypes from 'prop-types';

require('./TemplatePropertyCell.scss');

class TemplatePropertyCell extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { name, defaultValue, value, onEdit, onRemove, isActive } = this.props;

    return (
      <tr className={'template-property-cell' + (isActive ? ' active' : '')}>
        <td className="property">{name} : </td>
        <td className="defaultValue">{defaultValue}</td>
        <td className="value">{value}</td>
        <td className="actions">
          <button title="编辑" onClick={onEdit}>
            <i className="iconfont">&#xe83f;</i>
          </button>
          <button title="删除" onClick={onRemove}>
            <i className="iconfont">&#xe76b;</i>
          </button>
        </td>
      </tr>
    );
  }
}

TemplatePropertyCell.propTypes = {
  name: PropTypes.string,
  // value: PropTypes.string,
  onEdit: PropTypes.func,
  onRemove: PropTypes.func,
};

export default TemplatePropertyCell;
