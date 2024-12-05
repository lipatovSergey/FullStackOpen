import { useNotification } from '../contexts/NotificationContext'

const Notification = () => {
  const { notification } = useNotification()
  if (!notification || !notification.text) {
    return
  }

  const styles = {
    success: {
      color: 'green',
      background: 'lightgrey',
      fontSize: '20px',
      borderStyle: 'solid',
      borderRadius: '5px',
      padding: '10px',
      marginBottom: '10px'
    },
    error: {
      color: 'red',
      background: 'lightgrey',
      fontSize: '20px',
      borderStyle: 'solid',
      borderRadius: '5px',
      padding: '10px',
      marginBottom: '10px'
    }
  }

  return <div style={styles[notification.type]}>{`${notification.text}`}</div>
}

export default Notification
