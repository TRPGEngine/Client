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
class Image extends React.Component<Props> {
  state = {
    isLoading: true,
  };

  componentDidMount() {
    let mImg = new (window as any).Image();

    mImg.src = this.props.src;
    mImg.onload = () => {
      this.setState({ isLoading: false });
    };
    mImg = null;
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
        onLoad={() => console.log('aaaa')}
      />
    );
  }
}

export default Image;
