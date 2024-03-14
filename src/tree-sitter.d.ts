// 在项目的根目录下，比如在src下创建tree-sitter.d.ts，并添加以下内容
declare module 'web-tree-sitter' {
    export class Parser {
      static init(): Promise<void>;
      setLanguage(lang: any): void;
      parse(sourceCode: string): any;
    }
    // 根据需要添加其他需要的类或函数声明
  }
  