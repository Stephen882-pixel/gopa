import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { apiCall } from "../types";
import type { AuthProps, ConstantsProps } from "../types";

export const loadConstants = createAsyncThunk(
  "/cache/constants/",
  async (ignore: string, { getState }) => {
    const auth = (getState() as any)?.auth as AuthProps;
    return await apiCall("/cache/constants/", auth);
  },
);

const slice = createSlice({
  name: "constants",
  initialState: {
    countries: [],
    restrictionTypes: [],
    nonComplianceTypes: [],
    modeOfSupply: [],
    discriminativeList: [],
    typeOfMeasureList: [],
    yesNo: [],
    notificationStatus: [],
    complaintTypes: [],
    complaintStatus: [],
    restrictionStatus: [],
    reportDisplayTypes: [],
  } as ConstantsProps,
  reducers: {
  },
  extraReducers: (builder) => {
    // Load the sectors using the thunk implementation
    builder.addCase(loadConstants.fulfilled, (state, { payload }) => {
      state.countries = payload.countries;
      state.restrictionTypes = payload.restrictionTypes;
      state.nonComplianceTypes = payload.nonComplianceTypes;
      state.modeOfSupply = payload.modeOfSupply;
      state.discriminativeList = payload.discriminativeList;
      state.typeOfMeasureList = payload.typeOfMeasureList;
      state.yesNo = payload.yesNo;
      state.notificationStatus = payload.notificationStatus;
      state.complaintTypes = payload.complaintTypes;
      state.complaintStatus = payload.complaintStatus;
      state.restrictionStatus = payload.restrictionStatus;
      state.reportDisplayTypes = payload.reportDisplayTypes;
    })
  },
});

export default slice.reducer;
