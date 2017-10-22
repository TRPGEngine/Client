const React = require('react');
const PropTypes = require('prop-types');

require('./Tab.scss');

class Tab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectTab: {}
    }
  }

  componentDidMount() {
    this.setState({selectTab: this.props.items[0]});
  }

  render() {
    return (
      <div className="tab">
        <div className="tab-nav">
          {
            this.props.items.map((item) => (
              <div
                key={item.name}
                className={"tab-item" + (item.name===this.state.selectTab.name?' active':'')}
                onClick={() => this.setState({selectTab: item})}
              >
                <div className="tab-label">{item.label || item.name}</div>
              </div>
            ))
          }
        </div>
        <div className="tab-content">
          { this.state.selectTab.component }
        </div>
      </div>
    )
  }
}

Tab.propTypes = {
  items: PropTypes.array.isRequired,
}

module.exports = Tab;
