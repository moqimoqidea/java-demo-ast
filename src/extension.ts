import * as vscode from 'vscode';
import { Parser } from 'web-tree-sitter';

async function loadWasmParser() {
  await Parser.init();
  const parser = new Parser();
  const Lang = await require('web-tree-sitter-java')();
  parser.setLanguage(Lang);
  return parser;
}

async function getJavaContent(text: string) {
  const parser = await loadWasmParser();
  const tree = parser.parse(text);

  // 示例：获取类名、函数和变量
  console.log('Parsed tree:', tree);

  // 你可以根据需要进一步解析tree，这里只是一个基本示例
  let classNames: string[] = [];
  let functionNames: string[] = [];
  let variableNames: string[] = [];

  // 这里需要根据Java语法的实际树结构来遍历和解析，此处省略具体实现
  // 示例代码省略了具体的遍历和解析逻辑

  return {
    classNames,
    functionNames,
    variableNames
  };
}

export function activate(context: vscode.ExtensionContext) {
  console.log('Java Content Reader is now active!');

  let disposable = vscode.commands.registerCommand('javaContentReader.getJavaContent', async () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const document = editor.document;
      const text = document.getText();
      const content = await getJavaContent(text);
      console.log(content);
    }
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
