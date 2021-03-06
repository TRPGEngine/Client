const tagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

type TextParseResult = {
  expression: string;
  tokens: (string | { '@binding': string })[];
};

/**
 * 处理{{data}}格式的数据。 返回一个相关表达式和token
 * @param text 带{{data}}的字符串
 */
const parseText = (text: string): TextParseResult => {
  if (!tagRE.test(text)) {
    // 如果没有检测到{{}}格式的数据。则返回纯文本(转义一下)
    return {
      expression: JSON.stringify(text),
      tokens: [text],
    };
  }
  const tokens: string[] = [];
  const rawTokens: (string | { '@binding': string })[] = [];
  let lastIndex = (tagRE.lastIndex = 0);
  let match: RegExpExecArray;
  let index: number;
  let tokenValue: string;
  // tslint:disable-next-line: no-conditional-assignment
  while ((match = tagRE.exec(text)!)) {
    index = match.index;
    // push text token
    if (index > lastIndex) {
      rawTokens.push((tokenValue = text.slice(lastIndex, index)));
      tokens.push(JSON.stringify(tokenValue));
    }
    // tag token
    const exp = match[1].trim();
    tokens.push(`(${exp})`);
    rawTokens.push({ '@binding': exp });
    lastIndex = index + match[0].length;
  }

  if (lastIndex < text.length) {
    rawTokens.push((tokenValue = text.slice(lastIndex)));
    tokens.push(JSON.stringify(tokenValue));
  }
  return {
    expression: tokens.join('+'),
    tokens: rawTokens,
  };
};

export default parseText;
