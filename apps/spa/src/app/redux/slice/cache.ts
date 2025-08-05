import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { apiCall } from "../types";
import type { AuthProps, CacheProps } from "../types";

export const loadSectors = createAsyncThunk(
  "/pages/sectors/all_sectors/",
  async (ignore: string, { getState }) => {
    // One of the more unique bugs is that one needs to specify an arg so that
    // the payloadCreator can populate the thunkAPI object. Otherwise, if there
    // is no argument supplied, the thunkAPI object will always be null
    //
    // This is as at 23rd May 2025 using @reduxjs/toolkit v2.6.0
    // https://github.com/reduxjs/redux-toolkit/issues/489
    //
    // For mor information on the thunkAPI
    // https://redux-toolkit.js.org/api/createAsyncThunk#payloadcreator
    const auth = (getState() as any)?.auth as AuthProps;
    return await apiCall("/pages/sectors/all_sectors/", auth);
  },
);

const slice = createSlice({
  name: "cache",
  initialState: {
    restriction: null,
    sectorList: [],
    permissionMap: null,
  } as CacheProps,
  reducers: {
    setRestriction: (state, {payload}) => {
      state.restriction = payload;
    },
    setPermissionMap: (state, {payload}) => {
      state.permissionMap = payload || [];
    },
    setSectorList: (state, {payload}) => {
      state.sectorList = payload || [];
    },
  },
  extraReducers: (builder) => {
    // Load the sectors using the thunk implementation
    builder.addCase(loadSectors.fulfilled, (state, { payload }) => {
      state.sectorList = payload;
    })
  },
});

export const { setRestriction, setPermissionMap, setSectorList } = slice.actions;
export default slice.reducer;
