import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  visitorId: null,
  browserInfo: null
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
    }
  }
});

// Action creators are generated for each case reducer function
export const { setSessionUser, setVisitorId, setBrowserInfo } = authReducer.actions;

export default authReducer.reducer;
