import { createSlice } from "@reduxjs/toolkit";
import EnquiryConversation from "../../../database/models/enquiry_conversation";

type stateType = {
  numberOfNewMessages: number;
  conversations: EnquiryConversation[];
  activeConversation: EnquiryConversation | null;
};

const initialState: stateType = {
  numberOfNewMessages: 0,
  conversations: [],
  activeConversation: null
};

const messageReducer = createSlice({
  name: "messages", // name of the key in state
  initialState,
  reducers: {
    setNumberOfNewMessages: (state, action) => {
      state.numberOfNewMessages = action.payload;
    },
    setConversations: (state, action) => {
      state.conversations = action.payload;
    },
    setActiveConversation: (state, action) => {
      state.activeConversation = action.payload;
    }
  }
});

// Action creators are generated for each case reducer function
export const { setActiveConversation, setConversations, setNumberOfNewMessages } = messageReducer.actions;

export default messageReducer.reducer;
