import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  addRouteToApplicationHistory,
  deleteRouteFromApplicationHistory,
} from "../features/applicationHistory/applicationHistorySlice";
import PageJSON from "../../configuration/tailorYourApp.json";
import { AppDispatch, RootState } from "../store/store";

const useNavigation = () => {
  const pages = PageJSON.pages;
  const dispatch: AppDispatch = useDispatch();
  const applicationHistoryData = useSelector(
    (state: RootState) => state.applicationHistoryReducer.applicationHistoryData
  );
  const navigate = useNavigate();
  const location = useLocation();

  const currentPageIndex = pages.findIndex((page: any) => {
    return location.pathname.includes(page.name);
  });

  const nextPageIndex = currentPageIndex + 1;

  useEffect(() => {
    // Every time the user navigates to a new page, add it to the history stack.
    if (
      applicationHistoryData &&
      !applicationHistoryData.includes(location.pathname)
    ) {
      dispatch(addRouteToApplicationHistory(location.pathname));
    }
  }, [location.pathname, applicationHistoryData, dispatch]);

  const nextPage = (pageName?: string) => {
    if (currentPageIndex < pages.length - 1) {
      dispatch(
        addRouteToApplicationHistory(
          `/${pageName ? pageName : pages[nextPageIndex].name}`
        )
      );
      navigate(`/${pageName ? pageName : pages[nextPageIndex].name}`);
    }
  };

  const previousPage = () => {
    if (applicationHistoryData.length > 1) {
      dispatch(deleteRouteFromApplicationHistory(location.pathname));
      navigate(
        `${
          applicationHistoryData[
            applicationHistoryData.indexOf(location.pathname) - 1
          ]
        }`
      );
    }
  };

  return { nextPage, previousPage, currentPageIndex };
};

export default useNavigation;
