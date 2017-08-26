const React = require('react');
const { connect } = require('react-redux');
const { Route, Link } = require('react-router-dom')
const { showInfoCard } = require('../../redux/actions/ui');
const ConverseList = require('./converse/ConverseList');
const ExtraOptions = require('./ExtraOptions');

require('./MenuPannel.scss');

class MenuPannel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedMenu: 0
    };
    this.menus = [
      {
        icon: '&#xe63e;',
        activeIcon: '&#xe63e;',
        text: '消息',
        component: (
          <ConverseList />
        )
      },
      {
        icon: '&#xe61b;',
        activeIcon: '&#xe61b;',
        text: '人物卡',
      },
      {
        icon: '&#xe607;',
        activeIcon: '&#xe607;',
        text: '好友',
      },
      {
        icon: '&#xe624;',
        activeIcon: '&#xe624;',
        text: '记事本',
      },
    ]
  }

  render() {
    let { selectedMenu } = this.state;
    let { className, avatar } = this.props;
    return (
      <div className={className}>
        <div className="menu-pannel">
          <div className="profile">
            <div className="avatar" onClick={() => this.props.dispatch(showInfoCard())}>
              <img src={avatar || '/src/assets/img/gugugu1.png'} />
            </div>
          </div>
          <div className="menus">
            {
              this.menus.map((item, index) => {
                return (
                  <a
                    key={"menu-"+index}
                    className={selectedMenu===index?'active':''}
                    onClick={()=>this.setState({selectedMenu:index})}
                  >
                    <i className='iconfont' dangerouslySetInnerHTML={{__html:(selectedMenu===index?item.icon:item.activeIcon)}}></i>
                    <span>{item.text}</span>
                  </a>
                )
              })
            }
          </div>
          <ExtraOptions />
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
    avatar: state.getIn(['user', 'info', 'avatar'])
  })
)(MenuPannel);
