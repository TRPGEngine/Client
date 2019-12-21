import React from 'react';
import { Quill, Delta, Sources, DeltaStatic } from 'quill';
// 等 https://github.com/zenoamaro/react-quill/pull/549 这个pr过了以后看一下能不能把quill的类型搞到react-quill里
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styled from 'styled-components';

const Editor = styled(ReactQuill).attrs((props) => ({
  theme: 'snow',
}))`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

export default class TRPGEditor extends React.Component {
  state = {
    delta: null,
  };

  componentDidMount() {
    this.setState({
      delta: { ops: [] },
    });
  }

  handleChange = (content: string, delta: Delta, source: Sources, editor) => {
    const state: DeltaStatic = editor.getContents();
    console.log(state.ops);
  };

  render() {
    const { delta } = this.state;

    return <Editor defaultValue={delta} onChange={this.handleChange} />;
  }
}
