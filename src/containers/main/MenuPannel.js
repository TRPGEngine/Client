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
        url: '/main/conv',
        icon: 'comments',
        text: '消息',
      },
      {
        url: '/main/co123',
        icon: 'comments',
        text: '消息2',
      },
      {
        url: '/main/co122',
        icon: 'comments',
        text: '消息3',
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
                <Link
                  key={"menu-"+index}
                  to={item.url}
                  className={selectedMenu===index?'active':''}
                  onClick={()=>this.setState({selectedMenu:index})}
                >
                  <i className={selectedMenu===index?`fa fa-${item.icon} fa-2x`:`fa fa-${item.icon}-o fa-2x`}></i>
                  <span>{item.text}</span>
                </Link>
              )
            })
          }
        </div>
        <div className="menu-sub-panel">
          <Route name="conv" path="/main/conv" component={ConverseList} />
        </div>
      </div>
    )
  }
}

module.exports = connect(
  state => ({

  })
)(MenuPannel);
