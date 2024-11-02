import { createSlice } from "@reduxjs/toolkit";

let notificationTimeout;

const notificationSlice = createSlice({
  name: "notification",
  initialState: null,
  reducers: {
    setNotification(state, action) {
      return action.payload;
    },
    clearNotification(state, action) {
      return null;
    },
  },
});

export const { setNotification, clearNotification } = notificationSlice.actions;

export const setNotificationWithTimeout = (anecdote, time) => {
  return (dispatch) => {
    if (notificationTimeout) {
      clearTimeout(notificationTimeout);
    }

    dispatch(setNotification(anecdote));

    notificationTimeout = setTimeout(() => {
      dispatch(clearNotification());
    }, time);
  };
};

export default notificationSlice.reducer;
