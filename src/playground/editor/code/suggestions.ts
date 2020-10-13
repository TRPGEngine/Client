import { languages, IRange } from 'monaco-editor';

// https://microsoft.github.io/monaco-editor/playground.html#extending-language-services-completion-provider-example
function createProposals(range: IRange) {
  return [
    {
      label: 'Input',
      kind: languages.CompletionItemKind.Module,
      documentation: '基本输入框',
      insertText: '<Input name="$1" />',
      insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
      range,
    },
  ];
}

/**
 * 注册自定义提示
 */
export function registerLayoutCodeSuggest() {
  languages.registerCompletionItemProvider('xml', {
    provideCompletionItems: (model, position) => {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };
      return {
        suggestions: createProposals(range),
      };
    },
    triggerCharacters: [':'],
  });
}
