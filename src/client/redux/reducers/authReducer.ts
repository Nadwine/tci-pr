import { createSlice } from "@reduxjs/toolkit";
import { AccountTypeEnum } from "../../../../types/enums";
import Profile from "../../../database/models/profile";

type stateType = {
  user?: { id: number; email: string; username?: string; allowed: []; accountType: "landlord" | "admin" | "tenant"; Profile?: Profile };
  visitorId?: string;
  browserInfo?: string;
  appBuildNumber?: number;
  environment: "development" | "test" | "production" | null;
};

const initialState: stateType = {
  user: undefined,
  visitorId: undefined,
  browserInfo: undefined,
  appBuildNumber: undefined,
  environment: null
};

const authReducer = createSlice({
  name: "auth", // name of the key in state
  initialState,
  reducers: {
    setSessionUser: (state, action) => {
      state.user = action.payload;
    },
    setVisitorId: (state, action) => {
      state.visitorId = action.payload;
    },
    setBrowserInfo: (state, action) => {
      state.browserInfo = action.payload;
    },
    setAppBuildNumber: (state, action) => {
      state.appBuildNumber = action.payload;
    },
    setEnvironment: (state, action) => {
      state.environment = action.payload;
    }
  }
});

// Action creators are generated for each case reducer function
export const { setSessionUser, setVisitorId, setBrowserInfo, setAppBuildNumber, setEnvironment } = authReducer.actions;

export default authReducer.reducer;
