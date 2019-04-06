import React from 'react';
import PropTypes from 'prop-types';
import LoadingSpinner from './LoadingSpinner';

import './Loading.scss';

class Loading extends React.Component {
  render() {
    let body = '';
    if (this.props.show) {
      body = (
        <div className="mask">
          <div className="content">
            <LoadingSpinner />
            <span>{this.props.text}</span>
          </div>
        </div>
      );
    }

    return <div className="loading">{body}</div>;
  }
}

Loading.propTypes = {
  show: PropTypes.bool,
  text: PropTypes.string,
};

export default Loading;
