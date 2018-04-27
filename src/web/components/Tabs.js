const React = require('react');

require('./Tabs.scss');

class TabsController extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0
    }
  }

  render() {
    return (
      <div className="tab">
        <nav className="tab-nav">
          {
            React.Children.map(this.props.children, (element, index) => {
              return (
                <div
                  className={'tab-item' + (index===this.state.selectedIndex?' active':'')}
                  onClick={()=>this.setState({selectedIndex: index})}
                >{element.props.name}</div>
              )
            })
          }
        </nav>
        <div className="tab-content">
          {
            React.Children.map(this.props.children, (element, index) => {
              return (
                <div className={(index===this.state.selectedIndex?'active':'')}>
                  {element}
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}

class Tab extends React.Component {
  render() {
    return (
      <div className="tab-items">{this.props.children}</div>
    );
  }
}

module.exports = {TabsController, Tab};
