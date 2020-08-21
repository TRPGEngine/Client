/* eslint-disable @typescript-eslint/tslint/config */
/* eslint-disable react/no-string-refs */
import React from 'react';
import E from 'wangeditor';

import './NoteEditor.scss';

interface Props {
  value: string;
  onChange: (html: string) => void;
  onSave: (html: string) => void;
}
class NoteEditor extends React.Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      editorContent: '',
    };
  }

  componentDidMount() {
    const editor = new E(this.refs.toolbar, this.refs.editor);

    editor.customConfig.pasteFilterStyle = true;
    editor.customConfig.pasteIgnoreImg = false;
    editor.customConfig.debug =
      location.href.indexOf('wangeditor_debug_mode=1') > 0;
    editor.customConfig.zIndex = 50;
    editor.customConfig.menus = [
      'head', // 标题
      'bold', // 粗体
      'fontSize', // 字号
      'fontName', // 字体
      'italic', // 斜体
      'underline', // 下划线
      'strikeThrough', // 删除线
      'foreColor', // 文字颜色
      'backColor', // 背景颜色
      'link', // 插入链接
      'list', // 列表
      'justify', // 对齐方式
      'quote', // 引用
      // 'emoticon',  // 表情
      'image', // 插入图片
      'table', // 表格
      'video', // 插入视频
      // 'code',  // 插入代码
      'undo', // 撤销
      'redo', // 重复
    ];

    editor.customConfig.onchange = (html) => {
      this.setState({
        editorContent: html,
      });
      this.props.onChange && this.props.onChange(html);
    };
    editor.customConfig.onblur = (html) => {
      this.props.onSave && this.props.onSave(html);
    };

    editor.create();
    editor.txt.html(this.props.value); // 赋值内容
  }

  render() {
    return (
      <div className="note-editor">
        <div ref="toolbar" />
        <div ref="editor" className="editor-content" spellCheck={false} />
      </div>
    );
  }
}

export default NoteEditor;
