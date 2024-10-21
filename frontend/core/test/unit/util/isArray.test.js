import isArray from "../../../util/isArray";

const array = [1,2,3,4,5]
const string = "Not an Array"

describe("return true if value is an array", () => {
    it("returns true for array", () => {
      let result = isArray(array);
      expect(result).toBe(true);
    });
    it("returns false for a string", () => {
        let result = isArray(string);
        expect(result).toBe(false);
      });
  });