import React from 'react';
import { Quill, Delta, Sources, DeltaStatic } from 'quill';
// 等 https://github.com/zenoamaro/react-quill/pull/549 这个pr过了以后看一下能不能把quill的类型搞到react-quill里
import 'react-quill/dist/quill.snow.css';
import styled from 'styled-components';
import TLoadable from '@web/components/TLoadable';
import _isFunction from 'lodash/isFunction';

const ReactQuill = TLoadable(() => import('react-quill'));

const Editor = styled(ReactQuill).attrs((props) => ({
  theme: 'snow',
}))`
  height: 100%;
  display: flex;
  flex-direction: column;

  .ql-toolbar {
    text-align: left;
  }
`;

interface Props {
  defaultValue?: string | Delta;
  onChange?: (content: string) => void;
}
export default class TRPGEditor extends React.PureComponent<Props> {
  // state = {
  //   delta: null,
  // };

  // componentDidMount() {
  //   this.setState({
  //     delta: { ops: [] },
  //   });
  // }

  handleChange = (content: string, delta: Delta, source: Sources, editor) => {
    // const state: DeltaStatic = editor.getContents();

    _isFunction(this.props.onChange) && this.props.onChange(content);
  };

  render() {
    return (
      <Editor
        defaultValue={this.props.defaultValue}
        onChange={this.handleChange}
      />
    );
  }
}
