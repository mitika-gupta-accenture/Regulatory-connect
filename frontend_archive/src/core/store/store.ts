import { configureStore } from "@reduxjs/toolkit";
import applicationFormSlice from "../features/applicationForm/applicationFormSlice";
import applicationHistorySlice from "../features/applicationHistory/applicationHistorySlice";
import applicationFormFieldsSlice from "../features/applicationFormFields/applicationFormFieldsSlice";
import { useDispatch } from 'react-redux'
import { GetDefaultMiddleware } from "@reduxjs/toolkit/dist/getDefaultMiddleware";

export const sessionStorageMiddleware = () => {
  return (next: (arg0: any) => any) => (action: any) => {
    const result = next(action);
    sessionStorage.setItem('applicationState', JSON.stringify(store.getState()));
    return result;
  };
};

export const reHydrateStore = () => {
  const storedStateString = sessionStorage.getItem("applicationState");
  const parsedState = storedStateString ? JSON.parse(storedStateString) : {};
  return parsedState;
};

export const store = configureStore({
  reducer: {
    applicationFormReducer: applicationFormSlice,
    applicationFormFieldsReducer: applicationFormFieldsSlice,
    applicationHistoryReducer: applicationHistorySlice,
  },
  preloadedState: reHydrateStore(),
  middleware: (getDefaultMiddleware: GetDefaultMiddleware<any>) => getDefaultMiddleware().concat(sessionStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch