export type AstNode = AstNodeObj | AstNodeStr;

export type AstNodeObj = {
  tag: string;
  attrs: { [name: string]: string };
  content: AstNode[];
};

export type AstNodeStr = string;
