const React = require('react');
const tinymce = require('tinymce');
require('tinymce/themes/modern');
require('tinymce/plugins/wordcount');
require('tinymce/plugins/table');
require('tinymce/plugins/save');
require('tinymce/plugins/link');
require('tinymce/plugins/image');
require('tinymce/plugins/imagetools');
require('tinymce/plugins/textcolor');
require('tinymce/plugins/hr');
require('../../assets/lib/tinymce/zh_CN');

require('./TinyEditorComponent.scss');

class TinyEditorComponent extends React.Component {
  constructor() {
    super();
    this.editor = null;
  }
  componentDidMount() {
    tinymce.init({
      selector: `#${this.props.id}`,
      skin_url: 'src/assets/lib/tinymce/skins/lightgray',
      plugins: 'wordcount table save link image imagetools textcolor hr',
      toolbar: 'undo redo | styleselect forecolor backcolor | bold italic | alignleft aligncenter alignright alignjustify | link image | blockquote | save',
      imagetools_toolbar: 'rotateleft rotateright | flipv fliph | editimage imageoptions',
      height : 469 - 44,
      branding: false,
      statusbar: false,
      menu: {
        file: {title: 'File', items: 'newdocument trpgsavetocloud trpgsharenote'},
        edit: {title: 'Edit', items: 'undo redo | cut copy paste | selectall'},
        insert: {title: 'Insert', items: 'link image | hr'},
        view: {title: 'View', items: 'visualaid'},
        format: {title: 'Format', items: 'bold italic underline strikethrough superscript subscript | formats | removeformat'},
        table: {title: 'Table', items: 'inserttable tableprops deletetable | cell row column'},
      },
      setup: editor => {
        this.editor = editor;
        editor.on('keyup change', () => {
          const content = editor.getContent();
          this.props.onEditorChange(content);
        });
        editor.addMenuItem('trpgsavetocloud', {
          text: '保存到云端',
          context: 'tools',
          onclick: function() {
            // TODO
            console.log('保存到云端');
          }
        });
        editor.addMenuItem('trpgsharenote', {
          text: '分享笔记',
          context: 'tools',
          onclick: function() {
            // TODO
            console.log('分享笔记');
          }
        });
      },
      save_onsavecallback: () => this.props.onEditorSave(this.editor.getContent()),
    });
  }

  componentWillUnmount() {
    tinymce.remove(this.editor);
  }

  render() {
    return (
      <textarea
        id={this.props.id}
        value={this.props.content}
        onChange={e => console.log(e)}
      />
    );
  }
}

module.exports = TinyEditorComponent;
