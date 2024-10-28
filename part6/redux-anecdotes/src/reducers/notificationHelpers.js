// notificationHelpers.js
import { setNotification } from "./notificationReducer";

export const showNotification = (dispatch, message, delay = 5000) => {
  // Dispatch the action to set the notification
  dispatch(setNotification(message));

  // Clear the notification after the specified delay
  setTimeout(() => {
    dispatch(setNotification(null));
  }, delay);
};
