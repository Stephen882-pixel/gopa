import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

import authReducer, { initAuth } from "./slice/auth";
import cacheReducer, { loadSectors } from "./slice/cache";
import constantsReducer, { loadConstants } from "./slice/constants";

const store = configureStore({
  reducer: {
    auth: authReducer,
    cache: cacheReducer,
    constants: constantsReducer,
  },
});

export function initStore(root: HTMLElement) {
  const state = JSON.parse(root.getAttribute("data-state") as string);

  store.dispatch(initAuth(state));

  store.dispatch(loadConstants("dummy"));
  store.dispatch(loadSectors("dummy"));
}

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export default store;
