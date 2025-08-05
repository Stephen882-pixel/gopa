import { createSlice } from "@reduxjs/toolkit";
import { useLocale } from "ttag";
import { getLocale } from "@src/app/hooks/locale";

import type { AuthProps } from "../types";

function newProfile(payload: any, defaults?: any) {
  return {
    email: payload?.email || defaults?.email || null,
    username: payload?.username || defaults?.username || null,
    display_name: payload?.display_name || defaults?.display_name || null,
    first_name: payload?.first_name || defaults?.first_name || null,
    last_name: payload?.last_name || defaults?.last_name || null,
    locale: payload?.locale || defaults?.locale || null,
    phone: payload?.phone || defaults?.phone || null,
    avatar: payload?.avatar || defaults?.avatar || null,
    country: payload?.country || defaults?.country || null,
    darkMode: false === payload?.dark_mode ? false : (payload?.dark_mode || defaults?.darkMode || null),
  };
}

function setState(state: any, payload: any) {
  if ( payload?.profile?.locale && state.profile?.locale !== payload?.profile?.locale ) {
    useLocale(getLocale(payload.profile.locale).code);
  }
  state.token = payload?.token || null;
  state.csrf = payload?.csrf || null;
  state.user = payload?.user || null;
  state.profile = newProfile(payload?.profile || null);
}

const slice = createSlice({
  name: "auth",
  initialState: {csrf: null, token: null, user: null, profile: null} as AuthProps,
  reducers: {
    initAuth: (state, {payload}) => {
      setState(state, payload);
    },
    refreshProfile: (state, {payload}) => {
      if ( payload?.locale && state.profile?.locale !== payload?.locale ) {
        useLocale(getLocale(payload?.locale).code);
      }
      state.profile = newProfile(payload, state.profile);
    },
  },
});

export const { initAuth, refreshProfile } = slice.actions;
export default slice.reducer;
