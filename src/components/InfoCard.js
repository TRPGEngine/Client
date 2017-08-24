const React = require('react');
const PropTypes = require('prop-types');
const { connect } = require('react-redux');
const { hideInfoCard } = require('../redux/actions/ui');
require('./InfoCard.scss');

class InfoCard extends React.Component {
  render() {
    let body = '';
    if(this.props.show) {
      body = (
        <div className="mask">
          <div className="card">
            <div className="header">
              <div className="profile">
                <div className="avatar">
                  <img src={this.props.avatar || '/src/assets/img/gugugu1.png'} />
                </div>
                <span>{this.props.name}</span>
              </div>
              <div className="close" onClick={() => this.props.dispatch(hideInfoCard())}>
                <i className="iconfont">&#xe70c;</i>
              </div>
            </div>
            <div className="body">
              <div className="item">
                <span>唯一标识符:</span><span>{this.props.uuid}</span>
              </div>
            </div>
            <div className="footer">
              <div className="actions">

              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="info-card">
        {body}
      </div>
    )
  }
}

InfoCard.propTypes = {
  show: PropTypes.bool
}

module.exports = connect()(InfoCard);
