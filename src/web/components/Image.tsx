import React from 'react';
import config from '../../shared/project.config';
import Spin from './Spin';

interface Props
  extends React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > {
  src: string;
}
class Image extends React.PureComponent<Props> {
  state = {
    isLoading: true,
  };

  componentDidMount() {
    let mImg = new window.Image();

    mImg.src = this.props.src;
    mImg.onload = () => {
      this.setState({ isLoading: false });
    };
    mImg.onerror = () => {
      this.setState({ isLoading: false });
    };
    mImg = null; // 释放内存
  }

  render() {
    if (this.state.isLoading) {
      return <Spin />;
    }

    return (
      <img
        {...this.props}
        src={this.props.src}
        onError={() => {
          this.setState({ src: config.defaultImg.chatimg_fail });
        }}
      />
    );
  }
}

export default Image;
