import * as vscode from "vscode";
import { SyntaxNode } from "tree-sitter";

const Parser = require("web-tree-sitter");

async function getParser() {
  await Parser.init().then(() => {
    console.log("Tree-sitter WASM loaded");
  });
  const parser = new Parser();
  const Java = await Parser.Language.load("tree-sitter-java.wasm");
  parser.setLanguage(Java);
  return parser;
}

async function getJavaContent(text: string) {
  // 解析给定的文本
  const javaParser = await getParser();
  const tree = javaParser.parse(text);

  let classNames: string[] = [];

  // 遍历 AST
  traverse(tree.rootNode, (node: SyntaxNode) => {
    // 如果节点是一个类声明，那么提取出类名
    if (node.type === "class_declaration") {
      const classNameNode = node.namedChildren.find(
        (child: SyntaxNode) => child.type === "identifier"
      );
      if (classNameNode) {
        classNames.push(classNameNode.text);
      }
    }
  });

  return classNames;
}

function traverse(
  node: SyntaxNode,
  visit: (node: SyntaxNode) => boolean | void
) {
  const shouldContinue = visit(node);
  if (shouldContinue !== false) {
    for (const child of node.namedChildren) {
      traverse(child, visit);
    }
  }
}

export function activate(context: vscode.ExtensionContext) {
  console.log("Java Content Reader is now active!");

  let disposable = vscode.commands.registerCommand(
    "javaContentReader.getJavaContent",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const document = editor.document;
        const text = document.getText();
        const classNames = await getJavaContent(text);
        console.log(classNames);
        vscode.window.showInformationMessage(
          `Class Names: ${classNames.join(", ")}`
        );
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
