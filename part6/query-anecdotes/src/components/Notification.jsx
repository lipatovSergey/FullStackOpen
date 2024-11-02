import { useContext } from "react";
import { NotificationContext } from "../NotificationContext";

let notificationTimeout;

const Notification = () => {
  const { notification, dispatch } = useContext(NotificationContext);

  const style = {
    border: "solid",
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
  };

  if (notificationTimeout) {
    clearTimeout(notificationTimeout);
  }

  notificationTimeout = setTimeout(() => {
    dispatch({ type: "NULL" });
  }, 5000);

  if (!notification) return null;

  return <div style={style}>{notification}</div>;
};

export default Notification;
