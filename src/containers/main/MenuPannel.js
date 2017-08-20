const React = require('react');
const { connect } = require('react-redux');
const { Route, Link } = require('react-router-dom')

const ConverseList = require('./ConverseList');

require('./MenuPannel.scss');

class MenuPannel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedMenu: 0
    };
    this.menus = [
      {
        icon: 'comments',
        activeIcon: 'comments-o',
        text: '消息',
        component: (
          <ConverseList />
        )
      },
      {
        icon: 'id-card',
        activeIcon: 'id-card-o',
        text: '人物卡',
      },
      {
        icon: 'sticky-note',
        activeIcon: 'sticky-note-o',
        text: '记事本',
      },
    ]
  }

  render() {
    let { selectedMenu } = this.state;
    return (
      <div className={this.props.className}>
        <div className="menu-pannel">
          {
            this.menus.map((item, index) => {
              return (
                <a
                  key={"menu-"+index}
                  className={selectedMenu===index?'active':''}
                  onClick={()=>this.setState({selectedMenu:index})}
                >
                  <i className={selectedMenu===index?`fa fa-2x fa-${item.icon}`:`fa fa-2x fa-${item.activeIcon}`}></i>
                  <span>{item.text}</span>
                </a>
              )
            })
          }
        </div>
        <div className="menu-sub-panel">
          {this.menus[selectedMenu].component || ''}
        </div>
      </div>
    )
  }
}

module.exports = connect(
  state => ({

  })
)(MenuPannel);
