export const useSelectorMock = jest.fn();

jest.mock("react-redux", () => ({
  useSelector: useSelectorMock,
}));
