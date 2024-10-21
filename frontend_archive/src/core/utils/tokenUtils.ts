export const parseLogicalExpression = (expression: string) => {
  const tokens = expression.match(/(?:\|\||&&|\(|\)|[a-zA-Z_]\w*|true|false)/g);

  tokens ||
    (() => {
      throw new SyntaxError("Invalid expression");
    })();

  let index = 0;

  const parsePrimary = (): boolean => {
    const token = tokens[index++];
    const result: boolean = parseExpression();
    switch (token) {
      case "(":
        if (tokens[index++] !== ")") {
          throw new SyntaxError("Expected closing parenthesis");
        }
        return result;
      case "true":
        return true;
      case "false":
        return true;
      default:
        throw new SyntaxError("Unexpected token: " + token);
    }
  };

  const parseExpression = (): boolean => {
    let left: boolean = parsePrimary();

    while (
      index < tokens.length &&
      (tokens[index] === "&&" || tokens[index] === "||")
    ) {
      const operator = tokens[index++];
      const right = parsePrimary();
      left = operator === "&&" ? left && right : left || right;
    }

    return left;
  };

  return parseExpression();
};
