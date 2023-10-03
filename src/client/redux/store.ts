import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authReducer";
import messagesReducer from "./reducers/messagesReducer";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    message: messagesReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
