import React, { createContext, useReducer } from "react";

export const NotificationContext = createContext();

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "NEW_ANECDOTE":
      return `New anecdote added ${action.payload}`;
    case "VOTE_ANECDOTE":
      return `Anecdote voted ${action.payload}`;
    case "NULL":
      return null;
    default:
      return state;
  }
};

export const NotificationProvider = ({ children }) => {
  const [notification, dispatch] = useReducer(notificationReducer);

  return (
    <NotificationContext.Provider value={{ notification, dispatch }}>
      {children}
    </NotificationContext.Provider>
  );
};
