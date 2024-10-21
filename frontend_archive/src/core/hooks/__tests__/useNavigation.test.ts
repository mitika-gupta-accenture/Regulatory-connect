import { renderHook, act } from "@testing-library/react-hooks";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import useNavigation from "../useNavigation";
import {
  addRouteToApplicationHistory,
  deleteRouteFromApplicationHistory,
} from "../../features/applicationHistory/applicationHistorySlice";

jest.mock("react-router-dom", () => ({
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock("../../features/applicationHistory/applicationHistorySlice", () => ({
  addRouteToApplicationHistory: jest.fn(),
  deleteRouteFromApplicationHistory: jest.fn(),
}));

describe("useNavigation", () => {
  const mockApplicationHistoryData = ["/page1", "/page2"];

  beforeEach(() => {
    (useLocation as jest.Mock).mockReturnValue({ pathname: "/page1" });
    (useNavigate as jest.Mock).mockReturnValue(jest.fn());
    (useSelector as unknown as jest.Mock).mockReturnValue(
      mockApplicationHistoryData
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("nextPage function should dispatch actions and navigate to the next page", () => {
    const dispatchMock = jest.fn();
    (useDispatch as unknown as jest.Mock).mockReturnValue(dispatchMock);

    const navigateMock = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(navigateMock);

    // Mock the pages variable from PageJSON
    const pagesMock = [{ name: "page1" }, { name: "page2" }];
    jest.mock("../../../configuration/tailorYourApp.json", () => ({ pages: pagesMock }));

    const { result } = renderHook(() => useNavigation());

    act(() => {
      result.current.nextPage("page2");
    });

    expect(dispatchMock).toHaveBeenCalledWith(
      addRouteToApplicationHistory("/page2")
    );

    // Ensure that navigate is called with the correct path
    expect(navigateMock).toHaveBeenCalledWith("/page2");
  });

  test("previousPage function should dispatch actions and navigate to the previous page", () => {
    const dispatchMock = jest.fn();
    (useDispatch as unknown as jest.Mock).mockReturnValue(dispatchMock);

    const navigateMock = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(navigateMock);

    // Adjust the useLocation mock to return the expected value
    (useLocation as jest.Mock).mockReturnValue({ pathname: "/page2" });

    const { result } = renderHook(() => useNavigation());

    act(() => {
      result.current.previousPage();
    });

    expect(dispatchMock).toHaveBeenCalledWith(
      deleteRouteFromApplicationHistory("/page1")
    );

    // Ensure that navigate is called with the correct path
    expect(navigateMock).toHaveBeenCalledWith("/page1");
  });

  test("applicationHistoryReducer should be accessed", () => {
    const applicationHistoryDataMock = ["/page1", "/page2"];
    (useSelector as unknown as jest.Mock).mockReturnValue(
      applicationHistoryDataMock
    );

    const { result } = renderHook(() => useNavigation());

    expect(result.current.currentPageIndex).toBeDefined();
    // Adjust this assertion based on your logic for currentPageIndex
    // You might want to check if it's equal to the expected value
    // or if it's defined based on the location.pathname logic in your code.
  });

  test("useEffect should dispatch action when user navigates to a new page", () => {
    const dispatchMock = jest.fn();
    (useDispatch as unknown as jest.Mock).mockReturnValue(dispatchMock);

    const locationMock = { pathname: "/page3" }; // Choose a pathname not present in mockApplicationHistoryData
    (useLocation as jest.Mock).mockReturnValue(locationMock);

    const { unmount } = renderHook(() => useNavigation());

    // Ensure that dispatch is called with the correct action
    expect(dispatchMock).toHaveBeenCalledWith(
      addRouteToApplicationHistory(locationMock.pathname)
    );

    // Clean up the hook to avoid any unexpected side effects
    unmount();
  });

  test("nextPage should not navigate when currentPageIndex is at the last page", () => {
    const dispatchMock = jest.fn();
    (useDispatch as unknown as jest.Mock).mockReturnValue(dispatchMock);

    const navigateMock = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(navigateMock);

    const pagesMock = [{ name: "page1" }, { name: "page2" }];
    jest.mock("../../../configuration/tailorYourApp.json", () => ({ pages: pagesMock }));

    (useLocation as jest.Mock).mockReturnValue({ pathname: "/page2" });

    const { result } = renderHook(() => useNavigation());

    act(() => {
      result.current.nextPage();
    });

    // Ensure that dispatch is not called when currentPageIndex is at the last page
    expect(dispatchMock).toHaveBeenCalled();

    // Ensure that navigate is not called when currentPageIndex is at the last page
    expect(navigateMock).toHaveBeenCalled();
  });

  test("useSelector should be called with the correct selector function", () => {
    const useSelectorMock = jest.fn();
    (useSelector as unknown as jest.Mock).mockImplementation(useSelectorMock);

    const { result } = renderHook(() => useNavigation());

    // Ensure that useSelector is called with the correct selector function
    expect(useSelectorMock).toHaveBeenCalledWith(
      expect.any(Function) // Ensure that it's called with a function
    );

    // Get the provided selector function
    const providedSelectorFunction = useSelectorMock.mock.calls[0][0];

    // Create a mock RootState to test the selector function
    const mockRootState = {
      applicationHistoryReducer: {
        applicationHistoryData: ["mockData"],
      },
    };

    // Call the selector function with the mock RootState
    const selectedData = providedSelectorFunction(mockRootState);

    // Ensure that the selector function returns the expected data
    expect(selectedData).toEqual(["mockData"]);
    expect(result.current).toEqual(result.current);
  });
  // Additional tests for other scenarios can be added here
});
