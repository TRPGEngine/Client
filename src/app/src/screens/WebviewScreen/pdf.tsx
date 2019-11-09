import React from 'react';
import styled from 'styled-components/native';
import PDF from 'react-native-pdf';
import rnStorage from '@shared/api/rn-storage.api';
import md5 from 'md5';
import _isNumber from 'lodash/isNumber';
import _debounce from 'lodash/debounce';

const PDFView = styled(PDF)`
  flex: 1;
`;

interface Props {
  url: string;
  onLoadProgress?: (percent: number) => void;
  onLoadComplete?: (numberOfPages: number, path: string) => void;
  onError?: (error: object) => void;
  onChangeTitle?: (title: string) => void;
}
export default class PDFRender extends React.Component<Props> {
  state = {
    page: 1,
  };

  // 增加阅读进度记录
  saveProgress = _debounce((page) => {
    rnStorage.save(`document#${md5(this.props.url)}`, page);
  }, 500);

  componentDidMount() {
    rnStorage.get(`document#${md5(this.props.url)}`).then((page) => {
      if (_isNumber(page)) {
        this.setState({ page });
      }
    });
  }

  handlePageChanged = (page: number, numberOfPages: number) => {
    const { onChangeTitle } = this.props;

    onChangeTitle && onChangeTitle(`${page} / ${numberOfPages}`);

    this.saveProgress(page);
  };

  render() {
    const { url, onLoadProgress, onLoadComplete, onError } = this.props;

    return (
      <PDFView
        page={this.state.page}
        source={{
          uri: url,
          cache: true,
        }}
        onPageChanged={this.handlePageChanged}
        onLoadProgress={onLoadProgress}
        onLoadComplete={onLoadComplete}
        onError={onError}
      />
    );
  }
}
