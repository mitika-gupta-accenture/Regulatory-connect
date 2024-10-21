import { calculateFieldText } from "../utils/calculateFieldName";

describe("[calculateFieldName]", () => {
  it.each`
    scenario                               | isNumbered | fieldListLength
    ${"isNumbered is false"}               | ${false}   | ${2}
    ${"fieldListLength is smaller than 2"} | ${true}    | ${1}
  `(
    "returns the original text if $scenario",
    ({ isNumbered, fieldListLength }) => {
      // arrange
      const index = 0;
      const text = "foo";

      // act
      const result = calculateFieldText(
        fieldListLength,
        isNumbered,
        index,
        text
      );

      // assert
      expect(result).toBe(text);
    }
  );

  it("defaults the text to an empty string and trims space", () => {
    // arrange
    const index = 0;
    const fieldListLength = 2;
    const isNumbered = true;

    // act
    const result = calculateFieldText(fieldListLength, isNumbered, index);

    // assert
    expect(result).toBe("1");
  });

  it("returns the text with the index number +1 appended", () => {
    // arrange
    const index = 1;
    const fieldListLength = 2;
    const isNumbered = true;
    const text = "foo";

    // act
    const result = calculateFieldText(fieldListLength, isNumbered, index, text);

    // assert
    expect(result).toBe("foo 2");
  });
});
