export const calculateFieldText = (
  fieldListLength: number,
  isNumbered: boolean,
  index: number,
  text: string = ""
): string => {
  if (isNumbered && fieldListLength > 1) {
    return `${text} ${(index + 1).toString()}`.trim();
  }

  return text;
};
